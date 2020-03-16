import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import 'react-table';
import './inventory.less';
import axios from "axios";
import { toast } from 'react-toastify';

function Inventory (props) {

    const [data, setData] = useState([]);
    const [initData, setInitData] = useState([]);
    const [input, setInput] = useState({});
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    let [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/api/getData")
            .then(data => {
                return data.json();
            })
            .then(res => {
                setInitData(res.data);
                setIsLoaded(true);
                setError(null);

            })
            .catch(error => {
                setError(error);
                setIsLoaded(true);
            });
    }, []);

    function deleteRow(indx){
        console.log(data[indx]);
        let rows = [...data];
        rows.splice(indx, 1)
        let idToRemove = data[indx];
        axios.delete('http://localhost:3001/api/deleteData',{
            data: idToRemove
        })
            .then(res => {
                toast.success('Successfully deleted a record.', {
                    position: toast.POSITION.TOP_RIGHT
                });
                console.log(res.data);
            }).catch(error => {
            toast.error('Failure in deleting the record.', {
                position: toast.POSITION.TOP_RIGHT
            });
            console.log(error);
        });
        setInitData(rows)
        setData(rows)
    }

   function getKeys() {
     return Object.keys(data[0]);
   }

   function getHeader() {
        if(data.length > 0) {
            let keys = getKeys();
            let keysCount = [data[0]];
            return (keysCount.map((elem, index) => {
                    return (
                        <tr key={index}>
                            {// eslint-disable-next-line
                                keys.map((key) => {
                                    if(key !== '_id') {
                                        return (
                                            <th key={key}>{key.toUpperCase()}</th>
                                        )
                                    }
                                }
                            )}
                            <th>ACTION</th>
                        </tr>
                    )
                })
            )

        }
    }

   function getRows() {
       if(data.length > 0) {

           return (data.map((elem, index) => {
                   return (
                       <tr key={index}>
                           {// eslint-disable-next-line
                               Object.keys(elem).map((key) => {
                               if(key !== '_id') {
                                   return (
                                       <td key={key}>{elem[key]}</td>
                                   )
                               }
                           }
                           )}
                           <td>
                               <button type="button" className="btn btn-danger" onClick={() => deleteRow(index)}>
                                   <span className="glyphicon glyphicon-trash"/>
                               </button>
                           </td>
                       </tr>
                   )
               })
           )
       }
   }

   function onFileChangeHandler(e) {
       setSelectedFile(e.target.files[0]);
   }

   function onInputChange(e){
       setInput({...input, [e.target.name]: e.target.value });
    }

    //For checking when a data object property is empty
    function isEmpty(data){
        if(typeof(data) === 'object'){
            if(JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]'){
                return true;
            }else if(!data){
                return true;
            }
            return false;
        }else if(typeof(data) === 'string'){
            if(!data.trim()){
                return true;
            }
            return false;
        }else if(typeof(data) === 'undefined'){
            return true;
        }else{
            return false;
        }
    }

    //For removing null fields from search filter
    function cleanObject(obj){
        for (let propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
    }

    function matchesFilter(obj, count, item){
        for (var n = 0; n < obj.length; n++) {
            if (obj[n]["Search"].indexOf(item[obj[n]["Criteria"]]) > -1) {
                count++;
            }
        }
        return count === obj.length;
    };

    //Custom Search functionality for on the fly filter base searching. Makes easy for small data of products.
    // eslint-disable-next-line
    Array.prototype.searchFilter = function(obj){
        let matches = [], count = 0;
        for (var i = 0; i < this.length; i++) {
            if (matchesFilter(obj, count, this[i])) {
                matches.push(this[i]);
            }
        }
        return matches;
    };

    function onSearch() {
        let searchArray = [];
        if(isEmpty(input)){
            setData(initData);
        } else if (!isEmpty(input)){
            if(input.hasOwnProperty('Description')){
                if(!isEmpty(input.Description)){
                    searchArray.push({ Criteria: 'Description', Search: [input.Description]})
                }
            }
            if(input.hasOwnProperty('ShelfLife')){
                if(!isEmpty(input.ShelfLife)){
                    searchArray.push({ Criteria: 'ShelfLife', Search: [input.ShelfLife]})
                }
            }
            if(input.hasOwnProperty('Department')){
                if(!isEmpty(input.Department)){
                    searchArray.push({ Criteria: 'Department', Search: [input.Department]})
                }
            }
            if(input.hasOwnProperty('Price')){
                if(!isEmpty(input.Price)){
                    searchArray.push({ Criteria: 'Price', Search: [input.Price]})
                }
            }
            if(input.hasOwnProperty('Unit')){
                if(!isEmpty(input.Unit)){
                    searchArray.push({ Criteria: 'Unit', Search: [input.Unit]})
                }
            }
            cleanObject(input);
            console.log(input);
            let filtered = initData.searchFilter(searchArray);
            setData(filtered);
            console.log(filtered);
        }
        console.log(input);
    };

    //Upload functionality for uploading CSV files only.
    function onUploadHandler() {
        let count = 0;
        let results = [], errors = [];
        Papa.parse(selectedFile, {
            header: true,
            worker: true,
            skipEmptyLines: true,
            step: function(result) {
                results.push(result.data)
                setInitData(initData => [...initData, result.data]);
                setData(data => [...data, result.data]);
                count++;
            },
            complete: function() {
                console.log('parsing complete read', count, 'records.');
                console.log(results);
                results.forEach(function(product){
                    axios.post('http://localhost:3001/api/putData', product)
                        .then(res => {
                            if(res.data.error === true){
                                errors.push(res.data)
                            } else {
                                console.log(error);
                            }
                        }).catch(error => {
                        console.log(error);
                    });
                })
                if(errors.length === 0){
                    toast.success('Successfully added ' + count + ' records.', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    toast.error('Failure in adding records', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            }
        });
        fetch("http://localhost:3001/api/getData")
            .then(data => {
                return data.json();
            })
            .then(res => {
                setInitData(res.data)
                setData(res.data)
                //setData(res.data);

            })
            .catch(error => {
                setError(error);
            });

    }
        if (error) {
            return (
                <div className="row">
                    <div className="col-12">
                        <h2>Product Inventory</h2>
                    </div>
                    <div>Error: {error.message}</div>
                </div>
                );
        } else if (!isLoaded) {
            return (
                <div className="row">
                    <div className="col-12">
                        <h2>Product Inventory</h2>
                    </div>
                    <div>Loading...</div>
                </div>
                );
        } else {
            return (
                <div className="row">
                    <div className="col-md-12">
                        <h2>Product Inventory</h2>
                    </div>
                        <form className="col-12 center">
                            <div className="form-group col-2">
                            </div>
                            <div className="form-group col-7">
                                <input type="text" placeholder="Product" className="placement" name="Description" onChange={onInputChange}/>
                                <input type="text" placeholder="Shelf Life" className="placement" name="ShelfLife" onChange={onInputChange}/>
                                <input type="text" placeholder="Department" className="placement" name="Department" onChange={onInputChange}/>
                                <input type="text" placeholder="Price" className="placement" name="Price" onChange={onInputChange}/>
                                <input type="text" placeholder="Unit" className="placement" name="Unit" onChange={onInputChange}/>
                                <button type="button" className="btn btn-primary btn-shift" onClick={onSearch}><span className="glyphicon glyphicon-search"/> Search</button>
                                {/*Extra functonality for fun*/}
                                {/*<button type="button" className="btn btn-success btn-shift"><span className="glyphicon glyphicon-plus"/> Add</button>*/}
                            </div>
                            <div className="form-group col-3">
                                <input type="file" accept=".csv" name="file" onChange={onFileChangeHandler}/>
                                <button type="button" className="btn btn-primary btn-shift" onClick={onUploadHandler}>Upload</button>
                            </div>
                        </form>
                    <div className="col-lg-12">
                            <table className="table table-hover">
                                <thead>
                                    {getHeader()}
                                </thead>
                                <tbody>
                                    {getRows()}
                                </tbody>
                            </table>
                    </div>
                </div>
            );
        }
}

export default Inventory;
