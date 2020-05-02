const express = require('express');
const expressGraphQL = require('express-graphql');
const {
    GraphQLSchema, 
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt, 
    GraphQLNonNull,
} = require('graphql');
const app = express(); 

const authors = [
	{ id: 10, name: 'J. K. Rowling' },
	{ id: 20, name: 'J. R. R. Tolkien' },
	{ id: 30, name: 'Brent Weeks' }
]

const booksList = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]


// Actual root query
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: { type: GraphQLInt}
            }, 
            resolve: (parent, args) => booksList.find(book => book.id == args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all books',
            resolve: () => booksList
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => authors
        }
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorid: { type: GraphQLNonNull(GraphQLInt) },
        author: { 
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id == book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({ 
    name: 'Author', 
    description: 'This represents an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.id == author.id)
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
})


app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000, () => console.log('Server is up!!!'))

// const express = require('express');
// const expressGraphQL = require('express-graphql');
// const {
//     GraphQLSchema,
//     GraphQLObjectType,
//     GraphQLString,
//     GraphQLList,
//     GraphQLInt,
//     GraphQLNonNull,
// } = require('graphql')

// const app = express();

// const authors = [
// 	{ id: 1, name: 'J. K. Rowling' },
// 	{ id: 2, name: 'J. R. R. Tolkien' },
// 	{ id: 3, name: 'Brent Weeks' }
// ]

// const books = [
// 	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
// 	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
// 	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
// 	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
// 	{ id: 5, name: 'The Two Towers', authorId: 2 },
// 	{ id: 6, name: 'The Return of the King', authorId: 2 },
// 	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
// 	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
// ]

// const BookType = new GraphQLObjectType({
//     name: "Book",
//     description: "This represents a book written by an author",
//     fields: () => ({
//         id: { type:  GraphQLNonNull(GraphQLInt) },
//         name: { type: GraphQLNonNull(GraphQLString)},
//         authorId: { type: GraphQLNonNull(GraphQLInt) },
//         author: { 
//             type: AuthorType,
//             resolve: (book, args) => {
//                 return authors.find(author => author.id === book.authorId)
//             }
//         }
//     })
// })

// const AuthorType = new GraphQLObjectType({
//     name: "Author",
//     description: "This represents an author of a book",
//     fields: () => ({
//         id: { type:  GraphQLNonNull(GraphQLInt) },
//         name: { type: GraphQLNonNull(GraphQLString)},
//         books: { 
//             type: GraphQLList(BookType), 
//             resolve: (author) => {
//                 return books.filter(book => book.id === author.id)
//             }
//         }
//     })
// })


// const RootQueryType = new GraphQLObjectType({
//     name: 'Query',
//     description: 'Root Query',
//     fields: () => ({
//         books: {
//             type: new GraphQLList(BookType),
//             description: "List of Books",
//             resolve: (parent, args) => books
//         },
//         authors: {
//             type: new GraphQLList(AuthorType),
//             description: "List of Authors",
//             resolve: (parent, args) => authors
//         }
//     })
// })

// const schema = new GraphQLSchema({
//     query: RootQueryType 
// })

// app.use('/graphql', expressGraphQL({
//     graphiql: true,
//     schema: schema, 
// }))

// app.listen(5000, () => console.log('Server is up!'))