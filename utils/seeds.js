const { faker } = require('@faker-js/faker');
const Author = require('../models/authorModel');
const Book = require('../models/bookModel');

function createRandomAuthor() {
    let author = {
        name: faker.name.fullName(),
        phone_no: faker.phone.number('+91##########'),
        email: faker.internet.email(),
        password: "password"

    }
    return author;
}

function createRandomBook() {
    return faker.commerce.productAdjective() + " " + faker.name.lastName() + " " + faker.commerce.product();
}

async function seedRandomData(num) {
    for (var i = 0; i < num; i++) {
        let id;
        try {
            let rand_author = createRandomAuthor();
            let author = new Author({
                name: rand_author.name,
                email: rand_author.email,
                phone_no: rand_author.phone_no,
                password: "password"
            })
            await author.save();
            author = await Author.findOne({ email: rand_author.email });
            id = author._id;
        } catch (err) {
            console.log("Failure to create a random author❌")
            console.log(err);
            process.exit(0);
        }
        try {
            for (var i = 0; i < Math.random() * 7; i++) {
                let title = createRandomBook();
                let book = new Book({
                    title: title,
                    author: id
                })
                await book.save()
            }
        } catch (err) {
            console.log("Failure to create a random book❌", err);
            process.exit(0);
        }
    }
    console.log("The Database has been updated with new entries.")
}

module.exports = { seedRandomData };