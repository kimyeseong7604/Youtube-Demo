const express = require('express')
const app = express()
app.listen(7777)
app.use(express.json())

// 회원 DB
let db = new Map()
var id = 1

// 로그인
app.post('/login', (req, res) => {
    console.log(req.body)
    
    const { userId, password } = req.body
    var loginUser = {}

    db.forEach((user, id) => {
        if (user.userId === userId) {
            loginUser = user
        }
    })
    if (isExist(loginUser)) {
        if (loginUser.password == password) {
            res.status(200).json({
                message: `${loginUser.name}님 환영합니다.`
            })
        } else {
            res.status(401).json({
                message: "비밀번호가 일치하지 않습니다."
            })
        }
    }else{
        res.status(404).json({
            message: "존재하지 않는 회원입니다."
        })
    }
})

function isExist(obj) {
    if (Object.keys(obj).length){
        return true
    }else{
        return false
    }
}

// 회원가입
app.post('/join', (req, res) => {
    console.log(req.body)

    if (req.body == {}) {
        res.status(400).json({ message: "입력 값을 다시 확인해주세요." })
    } else {
        db.set(id++, req.body)
        res.status(201).json({ message: `${db.get(id - 1).name}님 환영합니다.` })
    }
})

app
    .route('/users/:id')

    // 회원정보 조회
    .get((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        console.log(id)
        const user = db.get(id)

        if (user == undefined) {
            res.status(404).json({
                message: "회원 정보를 찾을 수 없습니다"
            })
        } else {
            res.status(200).json({
                userId: user.userId,
                name: user.name
            })
        }
    })

    // 회원 탈퇴
    .delete((req, res) => {
        let { id } = req.params
        id = parseInt(id)

        console.log(id)
        const user = db.get(id)

        if (user == undefined) {
            res.status(404).json({
                message: "이미 탈퇴했거나 없는 회원입니다"
            })
        } else {
            db.delete(id)

            res.status(200).json({
                message: `${user.name}님 다음에 또 뵙겠습니다.`
            })
        }
    })