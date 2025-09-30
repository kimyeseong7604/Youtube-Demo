const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const e = require('express')

let db = new Map()

router
    .route('/')
    .post((req, res) => {
        const { name, userId } = req.body
        if (name && userId) {
            let sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)'
            let values = [name, userId]
            conn.query(sql, values,
                function (err, results) {
                    res.status(201).json(results)
                }
            )
        } else {
            res.status(400).json({
                message: "요청 값을 제대로 보내주세요."
            })
        }
    })

    .get((req, res) => {
        var { userId } = req.body

        let sql = 'SELECT * FROM `channels` WHERE `user_id` = ?'
        var channels = []
        if (userId) {
            conn.query(sql, userId,
                function (err, results) {
                    if (results.length) {
                        res.status(200).json(results)
                    }
                    else{
                        notFoundChannel(res)
                    }
                }
            )
        } else {
            res.status(400).end()
        }
    })


router
    .route('/:id')
    .put((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        var channels = db.get(id)
        var oldTitle = channels.channelTitle

        if (channels) {
            var newTitle = req.body.channelTitle

            channels.channelTitle = newTitle
            db.set(id, channels)
            res.status(200).json({
                message: `채널명이 성공적으로 수정되었습니다. 기존: ${oldTitle} -> 수정: ${newTitle}`
            })
        } else {
            res.status(404).json({
                message: "존재하지 않는 채널입니다."
            })
        }
    })

    .delete((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        var channels = db.get(id)
        if (channels) {
            db.delete(id)
            res.status(200).json({
                message: `${channels.channelTitle}님 채널이 삭제되었습니다.`
            })
        } else {
            res.status(404).json({
                message: "존재하지 않는 채널입니다."
            })
        }
    })

    .get((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        let sql = 'SELECT * FROM `channels` WHERE `id` = ?'
        conn.query(sql, id,
            function (err, results) {
                if (results.length)
                    res.status(200).json(results)
                else
                    notFoundChannel(res)
            }
        )
    })

function notFoundChannel(res) {
    res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다."
    })
}

module.exports = router