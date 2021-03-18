const express = 'express'
const multer = require('multer')
const bodyParser = require('body-parser')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'nodstokqlfatdv',
  host: 'ec2-35-171-57-132.compute-1.amazonaws.com',
  database: 'db8naoql3t68j6',
  password: '130cac90418ed25db0ccca60ba6491e595cefd5642877a717dd6c9b5797b9b81',
  port: 5432,
})

const getUsers = async (req, res, next) => {
  await pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.log('users-controller line 15')
    }
    res.status(200).json(results.rows)
  })
}

exports.getUsers = getUsers
