const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const { body, param, validationResult } = require('express-validator')

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (!err.isEmpty()) {
        return res.status(400).json(err.array())
    } else {
        return next()
    }
}

let db = new Map()

router
    .route('/')
    .post(
        [
            body("userId").notEmpty().isInt().withMessage('숫자 입력 필요'),
            body("name").notEmpty().isString().withMessage('문자 입력 필요'),
            validate
        ],
        (req, res) => {

            const err = validationResult(req)

            if (!err.isEmpty()) {
                return res.status(400).json(err.array())
            }

            const { name, userId } = req.body

            let sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)'
            let values = [name, userId]

            conn.query(sql, values,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    else
                        res.status(201).json(results)
                }
            )
        })

    .get([
        body("userId").notEmpty().isInt().withMessage('숫자 입력 필요'),
        validate
    ],
        (req, res) => {
            var { userId } = req.body

            let sql = 'SELECT * FROM `channels` WHERE `user_id` = ?'
            conn.query(sql, userId,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    if (results.length) {
                        res.status(200).json(results)
                    }
                    else {
                        notFoundChannel(res)
                    }
                }
            )
            res.status(400).end()
        })


router
    .route('/:id')
    .put(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            body("name").notEmpty().isString().withMessage('채널 명 오류'),
            validate
        ],
        (req, res) => {
            const err = validationResult(req)

            if (!err.isEmpty()) {
                return res.status(400).json(err.array())
            }

            let { id } = req.params
            id = parseInt(id)
            let { name } = req.body

            let sql = 'UPDATE `channels` SET `name` = ? WHERE id = ?'
            let values = [name, id]
            conn.query(sql, values,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.affectedRows == 0) {
                        return res.status(400).end()
                    } else {
                        res.status(200).json(results)
                    }
                }
            )
        })

    .delete(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            validate
        ],
        (req, res) => {
            const err = validationResult(req)

            if (!err.isEmpty()) {
                return res.status(400).json(err.array())
            }

            let { id } = req.params
            id = parseInt(id)

            let sql = 'DELETE FROM `users` WHERE `email` = ?'
            conn.query(sql, id,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.affectedRows == 0) {
                        return res.status(400).end()
                    } else {
                        res.status(200).json(results)
                    }
                }
            )
        })

    .get(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            validate

        ],
        (req, res) => {
            const err = validationResult(req)

            if (!err.isEmpty()) {
                return res.status(400).json(err.array())
            }

            let { id } = req.params
            id = parseInt(id)

            let sql = 'SELECT * FROM `channels` WHERE `id` = ?'
            conn.query(sql, id,
                function (err, results) {
                    if (err) {
                        console.log(err)
                        return res.status(400).end()
                    }

                    if (results.length)
                        res.status(200).json(results)
                    else
                        notFoundChannel(res)
                }
            )
        })

module.exports = router