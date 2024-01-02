import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';

const users = [
    {
        id: '1',
        name: { firstName: 'John', lastName: 'Doe' },
        email: 'john@example.com',
    },
    {
        id: '2',
        name: { firstName: 'Jane', lastName: 'Doe' },
        email: 'jane@example.com',
    },
    {
        id: '3',
        name: { firstName: 'Bob', lastName: 'Smith' },
        email: 'bob@example.com',
    },
    {
        id: '4',
        name: { firstName: 'Alice', lastName: 'Johnson' },
        email: 'alice@example.com',
    },
    {
        id: '5',
        name: { firstName: 'Charlie', lastName: 'Brown' },
        email: 'charlie@example.com',
    },
    {
        id: '6',
        name: { firstName: 'Eva', lastName: 'Williams' },
        email: 'eva@example.com',
    },
    {
        id: '7',
        name: { firstName: 'David', lastName: 'Jones' },
        email: 'david@example.com',
    },
    {
        id: '8',
        name: { firstName: 'Grace', lastName: 'Taylor' },
        email: 'grace@example.com',
    },
    {
        id: '9',
        name: { firstName: 'Sam', lastName: 'Miller' },
        email: 'sam@example.com',
    },
    {
        id: '10',
        name: { firstName: 'Lily', lastName: 'Davis' },
        email: 'lily@example.com',
    },
];

const posts = [
    { id: '1', title: 'Post 1', content: 'Content 1', authorId: '1' },
    { id: '2', title: 'Post 2', content: 'Content 2', authorId: '2' },
    { id: '3', title: 'Post 3', content: 'Content 3', authorId: '3' },
    { id: '4', title: 'Post 4', content: 'Content 4', authorId: '4' },
    { id: '5', title: 'Post 5', content: 'Content 5', authorId: '5' },
    { id: '6', title: 'Post 6', content: 'Content 6', authorId: '6' },
    { id: '7', title: 'Post 7', content: 'Content 7', authorId: '7' },
    { id: '8', title: 'Post 8', content: 'Content 8', authorId: '8' },
    { id: '9', title: 'Post 9', content: 'Content 9', authorId: '9' },
    { id: '10', title: 'Post 10', content: 'Content 10', authorId: '10' },
];

const comments = [
    { id: '1', text: 'Comment 1', authorId: '1', postId: '1' },
    { id: '2', text: 'Comment 2', authorId: '1', postId: '1' },
    { id: '3', text: 'Comment 3', authorId: '2', postId: '2' },
    { id: '4', text: 'Comment 4', authorId: '3', postId: '3' },
    { id: '5', text: 'Comment 5', authorId: '4', postId: '4' },
    { id: '6', text: 'Comment 6', authorId: '5', postId: '5' },
    { id: '7', text: 'Comment 7', authorId: '6', postId: '6' },
    { id: '8', text: 'Comment 8', authorId: '7', postId: '7' },
    { id: '9', text: 'Comment 9', authorId: '8', postId: '8' },
    { id: '10', text: 'Comment 10', authorId: '9', postId: '9' },
];

const typeDefs = gql`
    type Name {
        firstName: String
        lastName: String
    }

    type User {
        id: ID!
        name: Name
        email: String
        posts: [Post]
        comments: [Comment]
    }

    type Post {
        id: ID!
        title: String
        content: String
        author: User
        comments: [Comment]
    }

    type Comment {
        id: ID!
        text: String
        author: User
        post: Post
    }

    input NameInput {
        firstName: String
        lastName: String
    }

    input CreateUserInput {
        name: NameInput
        email: String!
    }

    input CreatePostInput {
        title: String!
        content: String!
        authorId: ID!
    }

    input CreateCommentInput {
        text: String!
        authorId: ID!
        postId: ID!
    }

    type Query {
        users: [User]
        posts: [Post]
        comments: [Comment]
    }

    type Mutation {
        createUser(input: CreateUserInput!): User
        createPost(input: CreatePostInput!): Post
        createComment(input: CreateCommentInput!): Comment
    }
`;

const resolvers = {
    Query: {
        users: () => users,
        posts: () => posts,
        comments: () => comments,
    },
    User: {
        posts: (user) => posts.filter((post) => post.authorId === user.id),
        comments: (user) =>
            comments.filter((comment) => comment.authorId === user.id),
    },
    Post: {
        author: (post) => users.find((user) => user.id === post.authorId),
        comments: (post) =>
            comments.filter((comment) => comment.postId === post.id),
    },
    Comment: {
        author: (comment) => users.find((user) => user.id === comment.authorId),
        post: (comment) => posts.find((post) => post.id === comment.postId),
    },
    Mutation: {
        createUser: (_, { input }) => {
            const newUser = {
                id: String(users.length + 1),
                name: input.name,
                email: input.email,
            };
            users.push(newUser);
            return newUser;
        },
        createPost: (_, { input }) => {
            const newPost = {
                id: String(posts.length + 1),
                title: input.title,
                content: input.content,
                authorId: input.authorId,
            };
            posts.push(newPost);
            return newPost;
        },
        createComment: (_, { input }) => {
            const newComment = {
                id: String(comments.length + 1),
                text: input.text,
                authorId: input.authorId,
                postId: input.postId,
            };
            comments.push(newComment);
            return newComment;
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
