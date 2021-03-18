const express = 'express'
const multer = require('multer')
const bodyParser = require('body-parser')
const { Pool, Client } = require('pg')

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
  const { first_name, last_name } = request.body

  try {
    await client.query(
      'INSERT INTO users (first_name, last_name) VALUES ($1, $2) RETURNING *',
      [first_name, last_name],
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

exports.getUsers = getUsers
exports.createUser = createUser
