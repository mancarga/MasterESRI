const users = [
    { username: 'ppc90', age: 30, premium: false },
    { username: 'lu65', age: 24, premium: true },
    { username: 'maria3', age: 36, premium: false },
    { username: 'abc123', age: 20, premium: false },
    { username: 'sergio58', age: 26, premium: true }
];

users.map(user => {
    if (user.premium) {
        console.log(`${user.username} tiene cuenta premium`)
    } else {
        console.log(`${user.username} no tiene cuenta premium`)
    }

});

const NoPremium = users.filter(user => !user.premium);
console.log(NoPremium);