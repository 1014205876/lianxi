let user = document.getElementById('user');
let password = document.getElementById('password');
// let see = document.getElementById('see');
// let nosee = document.getElementById('nosee');
let submit = document.getElementById('submit');
// see.onclick = function () {
//     password.type = 'text';
//     see.hidden = true
//     nosee.hidden = false
// }
// nosee.onclick = function () {
//     password.type = 'password';
//     nosee.hidden = true
//     see.hidden = false
// }
submit.onclick = function () {
    if (user.value) {
        if (password.value) {
            console.log(
                '提交成功',
                {
                    user: user.value,
                    password: password.value
                }
            )
        }
    }
}