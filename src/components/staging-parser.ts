import { ChangelogRow, ChangelogRowDuration, DurationInterval, DurationIntervals, JiraApiIssue } from '../types';

//"2023-02-21T09:58:12.778+0100"
const toDate = (dateStr:string):Date => {
  return dateStr ? new Date(dateStr) : null;
}

export function round1dec(num:number){
  return num !== null ? Math.round(num * 10) / 10 : null;
}
  
export function round2dec(num:number){
  return num !== null ? Math.round(num * 10) / 10 : null;
}

const dateDiffDays = (from:Date, to:Date):number => {
  return (to.getTime() - from.getTime()) > 1*60 *1000 /* more than 1 min */ ? round2dec((to.getTime() - from.getTime()) / (24 * 3600 * 1000)) : null;
}

const toChangelogRowDuration = (fromDateValue:Date, toDateValue:Date, fromValue:string): ChangelogRowDuration => {
  let diffDays:number = dateDiffDays(fromDateValue, toDateValue);
  const durationInterval:DurationInterval = {
    fromDate: fromDateValue,
    toDate: toDateValue,
    durationDays: diffDays
  }
  const rd:ChangelogRowDuration = {
    fromValue: fromValue,
    durationInterval: durationInterval
  }
  return rd;
}



const populateStages = (issue: JiraApiIssue):Map<string, DurationIntervals> => {
  const nowAt:Date = new Date();
  const changelog:Array<ChangelogRow> = new Array();
  // 1. row extract
  issue.changelog.histories.forEach(history => {
    const created: string = history['created'];
    history.items.forEach(historyItem => {
      if (historyItem['field'] === 'status') {
        const fromString: string = historyItem.fromString;
        const toString: string = historyItem.toString;

        const row: ChangelogRow = {
          fromValue: fromString,
          toValue: toString,
          created: created        
        };
        changelog.push(row);
      }      
    });
  });

  // 2. sort by created
  changelog.sort((a, b) => (a.created > b.created ? 1 : -1));

  // 3. add durations
  const rowDurations:Array<ChangelogRowDuration> = new Array();
  for (let i = 0; i < changelog.length; i++) {
    const row = changelog[i];

    const rd:ChangelogRowDuration = toChangelogRowDuration(toDate(i === 0 ? issue.fields.created : changelog[i-1].created), toDate(row.created), row.fromValue);
    rowDurations.push(rd);
  }


  // 4. 
  //in progress & done: tailings
  if(changelog.length === 0){
    const currentRd:ChangelogRowDuration = toChangelogRowDuration(toDate(issue.fields.created), nowAt, issue.fields.status.name);
    rowDurations.push(currentRd);
  }else{
    const lastChlDate:Date = rowDurations[rowDurations.length-1].durationInterval.toDate;
    const currentRd:ChangelogRowDuration = toChangelogRowDuration(lastChlDate, nowAt, issue.fields.status.name);
    rowDurations.push(currentRd);
  }

  // 5. map
  const statusMap = new Map<string, DurationIntervals>();
  for (let i = 0; i < rowDurations.length; i++) {
    const row:ChangelogRowDuration = rowDurations[i];
    const status:string = row.fromValue;
    const nextDurationInterval:DurationInterval = row.durationInterval;

    let newDurationIntervals:DurationIntervals = null;
    if(statusMap.has(status)){
      const oldDurationIntervals:DurationIntervals = statusMap.get(status);

      if(oldDurationIntervals.fromDates === undefined || oldDurationIntervals.fromDates == null){
        oldDurationIntervals.fromDates = new Array<Date>();
      }
      if(oldDurationIntervals.toDates === undefined || oldDurationIntervals.toDates == null){
        oldDurationIntervals.toDates = new Array<Date>();
      }
      oldDurationIntervals.fromDates.push(nextDurationInterval.fromDate);
      oldDurationIntervals.toDates.push(nextDurationInterval.toDate);

      newDurationIntervals = {
        fromDates: oldDurationIntervals.fromDates,
        toDates: oldDurationIntervals.toDates,
        durationDays: oldDurationIntervals.durationDays + nextDurationInterval.durationDays
      }
    }else{
      newDurationIntervals = {
        fromDates: new Array<Date>(nextDurationInterval.fromDate),
        toDates: new Array<Date>(nextDurationInterval.toDate),
        durationDays: nextDurationInterval.durationDays
      }      
    }    
    statusMap.set(status, newDurationIntervals);
  }


  return statusMap;
};



export {
  populateStages,
};