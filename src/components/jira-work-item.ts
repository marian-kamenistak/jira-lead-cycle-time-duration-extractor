import { DurationIntervals, JiraExtractorConfig } from '../types';

export const numTo2 = (s:number): string => s < 9 ? "0"+s : s.toString();

export const dateToString = (date: Date): string => `${date.getUTCFullYear()}-${numTo2(date.getUTCMonth() + 1)}-${numTo2(date.getUTCDate())} ${numTo2(date.getUTCHours())}:${numTo2(date.getUTCMinutes())}:${numTo2(date.getSeconds())}`;

class JiraWorkItem  {
  id: string;
  stages: Map<string, DurationIntervals>;
  name: string;
  type: string;
  attributes: {
    [val: string]: string;
  };
  constructor(id: string = '', stages: Map<string, DurationIntervals>, name: string = '', type: string = '', attributes: {} = {}) {
    this.id = id;
    this.stages = stages;
    this.name = name;
    this.type = type;
    this.attributes = attributes;
  }




  toCSV(config: JiraExtractorConfig, stageNames:string[]): string[] {
    let line:string[] = [this.id, `${config.connection.url}/browse/${this.id}`, this.name, this.type];

    
    stageNames.forEach(stageName => {
      line.push(this.stages.has(stageName) && this.stages.get(stageName).durationDays > 0 ? ''+this.stages.get(stageName).durationDays : '');
    });
    stageNames.forEach(stageName => {
      const dates:Array<Date> = !this.stages.has(stageName) || this.stages.get(stageName).fromDates === undefined || this.stages.get(stageName).fromDates == null ? new Array() : this.stages.get(stageName).fromDates;
      const datesStr:string[] = dates.map((a) => dateToString(a));
      line.push(datesStr.length > 0 ? datesStr[datesStr.length-1]:'');
    });

    const attributeKeys = this.attributes ? Object.keys(this.attributes) : [];
    for (let index = 0; index < attributeKeys.length; index++) {
      const attributeKey = attributeKeys[index];
      line.push(this.attributes[attributeKey]);
    }

    line = line.map((a) => JiraWorkItem.cleanString(a));
    return line;
  }

  static cleanString(s: string = ''): string {
    return '"' +
    s.replace(/"/g, '""')
    .replace(/'/g, '')
    .replace(/,/g, '-')
    .replace(/\\/g, '')
    .trim()
    +'"';
  };
};

export {
  JiraWorkItem,
};