import React, { useState, useEffect } from "react";

export default function CountryCapitalGame({ data }) {
  const [newJson, setNewJson] = useState([]);
  const [jsonShuffleItems, setJsonShuffleItems] = useState([]);
  const [firtsItem, setFirtsItem] = useState('');

  const shuffleArray = (array) => {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  const selectItem = (item, index) => {
    const newItemsTemporal = [...jsonShuffleItems];
    newItemsTemporal[index] = {
      ...item,
      select: true
    }
    setJsonShuffleItems(newItemsTemporal);
    compareItems(item, index)
  }

  const compareItems = (item, index) => {
    if (!firtsItem) {
      clearSelect()
      setFirtsItem(item.value)
      return
    }

    for (const [country, capital] of Object.entries(data)) {
      if (country === firtsItem || capital === firtsItem) {
        if (capital === item.value || country === item.value) {
          if(firtsItem !== item.value){
            const deleteItems = jsonShuffleItems.filter((e) => e.value !== firtsItem && e.value !== item.value)
            setJsonShuffleItems(deleteItems);
            clearSelect()
            setFirtsItem('')
          }
        } else {
          bothInvalidButtons(item, index)
        }
      }
    }
  }

  const bothInvalidButtons = (item, index) =>{
    const newItemsTemporal = [...jsonShuffleItems];
    newItemsTemporal[index] = {
      ...item,
      valid: true
    }
    for (const item of newItemsTemporal) {
      if (item.select) {
        item.valid = true;
        item.select = false;
      }
    }
    setJsonShuffleItems(newItemsTemporal);
    setFirtsItem('');
  }

  const clearSelect = () => {
    for (const item of jsonShuffleItems) {
      item.select = false;
      item.valid = false;
    }
  }

  const getColorButton = (status) => {
    if (status.select)
      return '#0000ff';
    else if (!status.select && status.valid)
      return '#ff0000';
    else return '#efefef'; 
  }

  useEffect(() => {
    if (data) {
      for (const [country, capital] of Object.entries(data)) {
        setNewJson(prev => [...prev, { 'value': country, 'select': false, 'valid': false }])
        setNewJson(prev => [...prev, { 'value': capital, 'select': false, 'valid': false }])
      }
    }
  }, [data]);

  useEffect(() => {
    if(newJson && newJson.length > 0){
      setJsonShuffleItems(shuffleArray(newJson))
    }
  }, [newJson])

  return (
    <>
      {jsonShuffleItems && jsonShuffleItems.length ? jsonShuffleItems.map((item, index) => (
        <button key={index} style={{ 'backgroundColor': getColorButton(item), 'marginRight': 10, borderRadius: 5, padding: '0.5rem 1rem', border: '1px solid silver' }} onClick={() => selectItem(item, index)}>{item.value}
        </button>
      )) : (
      <div style={{ fontSize: 20, fontWeight: 600, }}>Congratulations</div>
      )}
    </>
  );
}
