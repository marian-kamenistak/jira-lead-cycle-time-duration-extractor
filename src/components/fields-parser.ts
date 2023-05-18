const parseLeafAttribute = (attribute: any, customProp?: string): string => {
  if (attribute === undefined || attribute == null) {
    return '';
  } else if (typeof attribute === 'string') {
    return attribute;
  } else if (typeof attribute === 'boolean') {
    return attribute.toString();
  } else if (typeof attribute === 'number') {
    return attribute.toString();
  } else {
    //object:
    return customProp ? attribute[customProp]: JSON.stringify(attribute);
  }
};

const parseArray = (nextData:any, lastNodesKey:string[]) => {
  const lastNodeKey:string = lastNodesKey && lastNodesKey.length > 0 ? lastNodesKey[0] : null;
  if(lastNodeKey === 'last'){
    nextData = nextData.length > 0 ? nextData[nextData.length-1] : undefined; // pick the latest value
  }else if(lastNodeKey === 'first'){
      nextData = nextData.length > 0 ? nextData[0] : undefined; // pick the first value
  }else{
    const parsedArrayValues: string[] = nextData.map(e => parseLeafAttribute(e, lastNodeKey));
    nextData = parsedArrayValues.length === 0 ? '' : (parsedArrayValues.length === 1 ? parsedArrayValues[0] 
      : 
      (lastNodesKey && lastNodesKey.length >= 2 ? parsedArrayValues.map(e => parseLeafAttribute(e, lastNodesKey[1])) : JSON.stringify(parsedArrayValues)));
  }
  return nextData;
}


const getAttributes = (fields: any, attributesRequested: string[]): { [val: string]: string } => {
  return attributesRequested.reduce((attributesMap, attributeSystemName) => {
    let nestedAttrKeys: string[] = attributeSystemName.split('.');
    const isNested:boolean = nestedAttrKeys.length > 1;
    if(!isNested){
      nestedAttrKeys = [attributeSystemName];            
    }
    let nextData:any = { ...fields};//cloned object
    for (let i = 0; i < nestedAttrKeys.length; i++) {
      const nextNodeKey = nestedAttrKeys[i];        
      if(nextData === null || nextData === undefined){
        nextData = ''; break;
      }
      nextData = nextData[nextNodeKey];
      if(nextData !== undefined && Array.isArray(nextData)){
        const lastNodesKey:string[] = i < nestedAttrKeys.length-1 ? nestedAttrKeys.slice(i+1, nestedAttrKeys.length) : null;
        if(nextData && nextData.length > 0 && lastNodesKey && lastNodesKey.length >= 1 && lastNodesKey[1] === 'outwardIssue'){ //TODO: fix the hack how we filter linked issues.
          nextData = nextData.filter(e => !(e.type?.outward === undefined || e.type?.outward == null));// e.type?.outward !== 'clones'
        }
        nextData = parseArray(nextData, lastNodesKey);
        if(lastNodesKey){
          i++;
        }
      }
    };
    
    const foundValue: string = parseLeafAttribute(nextData);
    attributesMap[attributeSystemName] = foundValue;
    
    return attributesMap;
  }, {});
};

export {
  getAttributes,
};