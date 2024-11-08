import express from "express"
import mysql from "mysql2/promise"
import { configDB } from "./configDB.js"
import cors from "cors"

const PORT=8000
let connection

try {
    connection=await mysql.createConnection(configDB)
} catch (error) {
    console.log(error);
}

const app=express()
app.use(express.json())
app.use(cors())

app.get("/todos",async(req,resp)=>{
    try {
        const sql="SELECT * FROM todos ORDER BY TIMESTAMP desc"
        const [rows,field]=await connection.execute(sql)
        console.log(rows,field);
        resp.json(rows)
    } catch (error) {
        console.log(error);
    
    }
})

app.post("/todos",async(req,resp)=>{
    const {task}=req.body
    if(!task)return res.statusCode(400).json({msg:"hiányos adat!"})
    try {
        const sql="INSERT INTO todos (task) VALUES (?)"
        const values=[task]
        const [rows,field]=await connection.execute(sql,values)
        resp.status(200).json({msg:"sikeres hozzáadás"})
    } catch (error) {
        console.log(error);
        resp.statusCode(500).json({msg:"server error"})
    }
})

app.delete("/todos/:id",async(req,resp)=>{
    const {id}=req.params
    if(!id)return res.statusCode(400).json({msg:"hiányos adat!"})
    try {
        const sql="DELETE from todos WHERE id=?"
        const values=[id]
        const [rows,field]=await connection.execute(sql,values)
        resp.status(200).json({msg:"sikeres törlés"})
    } catch (error) {
        console.log(error);
        resp.statusCode(500).json({msg:"server error"})
    }
})

app.put("/todos/completed/:id",async(req,resp)=>{
    const {id}=req.params
    if(!id&&!task)return res.statusCode(400).json({msg:"hiányos adat!"})
    try {
        const sql="UPDATE todos SET completed=NOT completed WHERE id=?"
        const values=[id]
        const [rows,field]=await connection.execute(sql,values)
        resp.status(200).json({msg:"sikeres modosítás"})
    } catch (error) {
        console.log(error);
        resp.statusCode(500).json({msg:"server error"})
    }
})

app.put("/todos/task/:id",async(req,resp)=>{
    const {id}=req.params
    const {task}=req.body
    if(!id&&!task)return res.statusCode(400).json({msg:"hiányos adat!"})
    try {
        const sql="UPDATE todos SET task=?  WHERE id=?"
        const value=[task,id]
        const [rows,field]=await connection.execute(sql,value)
        resp.status(200).json({msg:"sikeres modosítás"})
    } catch (error) {
        console.log(error);
        resp.statusCode(500).json({msg:"server error"})
    }
})  

app.listen(PORT, ()=>console.log("server listeing on port:"+PORT));