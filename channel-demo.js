const express = require('express')
const app = express()
app.listen(7777)
app.use(express.json())

// 회원 DB
let db = new Map()
var id = 1

app
    .route('/channels')

    // 채널 개별 생성
    .post((req, res) => {
        if (req.body.channelTitle) {
            db.set(id++, req.body)

            res.status(201).json({
                message: `${db.get(id - 1).channelTitle}님 채널을 응원합니다`
            })
        } else {
            res.status(400).json({
                message: "입력 값을 다시 확인해주세요."
            })
        }
    })

    // 채널 전체 조회
    .get((req, res) => {
        var channels = []

        if (db.size) {
            db.forEach((value, key) => {
                channels.push(value)
            })

            res.status(200).json(channels)       
        } else {
            res.status(404).json({
                message: "조회할 채널이 존재하지 않습니다."
            })
        }

        // res.status(200).json(Array.from(db.values()))
    })


app
    .route('/channels/:id')

    // 채널 개별 수정
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

    // 채널 개별 삭제
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

    // 채널 개별 조회
    .get((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        var channels = db.get(id)
        if (channels) {
            res.status(200).json(channels)
        } else {
            res.status(404).json({
                message: "존재하지 않는 채널입니다."
            })
        }
    })
