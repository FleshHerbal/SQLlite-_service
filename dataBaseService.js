import sqlite3 from "sqlite3";
//npm install sqlite3

export default class DataBaseService{
    constructor(query = "", type = types.run){
        this._query = query;
        this._type = type;
        this._dbPath = "./dictionary.db";
        this._createTables();
    } 
	
    _createTables(){
        const querys = []
        // querys.push("CREATE TABLE IF NOT EXISTS your_table_name (id INTEGER PRIMARY KEY AUTOINCREMENT, ... )");

        querys.forEach(element => {
            const db = new sqlite3.Database(this._dbPath, (err) => {
                if(err) console.log(`Error created table: ${err.message}`);
                db.run(element, (err) => {
                    if(err) console.log(`Error add create table: ${err.message}`);
                });
            })
            this._closeDb(db);
        });
    }

    _runTransaction(arrayData){
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this._dbPath, (err) => {
                if(err) reject(err.message);
                db.run(this._query, arrayData, (err)=>{
                    if(err) reject(err.message);
                    resolve("ok");
                })
            })
            this._closeDb(db);
        })
    }

    _allTransaction(){

        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this._dbPath, (err) => {
                if(err) reject(err.message);
                db.all(this._query, (err, rows) => {
                    if(err) reject(err.message);
                    resolve(rows);
                })
            })
            this._closeDb(db);
        })
    }

    _getTransaction(){
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this._dbPath, (err) => {
                if(err) reject(err.message);
                db.get(this._query, (err, row) => {
                    if(err) reject(err.message);
                    resolve(row);
                })
            })
            this._closeDb(db);
        })
    }
    _closeDb(db){
        db.close();
    }

    startTransaction(arrayData = []){
        switch (this._type) {
            case types.all:
                return this._allTransaction();
            case types.get:
                return this._getTransaction();
            case types.run:
                return this._runTransaction(arrayData);        
            default:
                return new Promise((_, reject) => reject("type not select"));
        }
    }

}
