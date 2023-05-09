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

const parseArray = (nextData:any, lastNodeKey:string) => {
  if(lastNodeKey === 'last'){
    nextData = nextData.length > 0 ? nextData[nextData.length-1] : undefined; // pick the latest value
  }else if(lastNodeKey === 'first'){
      nextData = nextData.length > 0 ? nextData[0] : undefined; // pick the first value
  }else{
    const parsedArrayValues: string[] = nextData.map(e => parseLeafAttribute(e, lastNodeKey));
    nextData = parsedArrayValues.length === 0 ? '' : (parsedArrayValues.length === 1 ? parsedArrayValues[0] : JSON.stringify(parsedArrayValues));
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
        const lastNodeKey:string = i < nestedAttrKeys.length-1 ? nestedAttrKeys[i+1] : null;
        nextData = parseArray(nextData, lastNodeKey);
        if(lastNodeKey){
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