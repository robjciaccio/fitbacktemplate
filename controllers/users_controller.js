const express = 'express'
const multer = require('multer')
const bodyParser = require('body-parser')
const { Pool, Client } = require('pg')
const { response } = require('express')

const connectionString =
  'postgres://nodstokqlfatdv:130cac90418ed25db0ccca60ba6491e595cefd5642877a717dd6c9b5797b9b81@ec2-35-171-57-132.compute-1.amazonaws.com:5432/db8naoql3t68j6'

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

// client.query('SELECT * FROM users', (err, res) => {
//   if (err) throw err
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row))
//   }
//   client.end()
// })

client.connect()

const getUsers = async (req, res, next) => {
  await client.query('SELECT * FROM users', (err, result) => {
    if (result == undefined) {
      console.log('users-controller line 15')
      next()
    } else {
      res.status(200).json(result.rows)
    }
  })
}

const createUser = async (request, response, next) => {
  const now = new Date()
  const {
    first_name,
    last_name,
    birthday,
    gender,
    email,
    password,
    address,
    city,
    state,
    phone,
  } = request.body

  const lowerEmail = email.toLowerCase()

  try {
    await client.query(
      'INSERT INTO users (first_name, last_name, birthday, gender, email, password, address, city, state, phone, join_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        first_name,
        last_name,
        birthday,
        gender,
        lowerEmail,
        password,
        address,
        city,
        state,
        phone,
        now,
      ],
      (err, result) => {
        console.log(result)
        if (result == undefined) {
          newError = 'Username or Email already exist. Please try again'
          response.status(500).json({ msg: err })
          next()
        } else {
          response.status(201).json(result.rows)
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  const lowerEmail = email.toLowerCase()

  try {
    await client.query(
      'SELECT * FROM users WHERE email = $1',
      [lowerEmail],
      (err, result) => {
        console.log(result.rows[0].password)
        if (result == undefined) {
          res.status(500).json({ msg: 'email not found' })
        } else {
          if (result.rows[0].password != password) {
            res.status(500).json({ msg: 'Incorrect Password' })
          } else {
            res.status(201).json(result.rows)
          }
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}

exports.getUsers = getUsers
exports.createUser = createUser
exports.loginUser = loginUser
