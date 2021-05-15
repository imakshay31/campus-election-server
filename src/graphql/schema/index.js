const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type User {
        _id : ID!
        email : String!
        isCandidate : Boolean
        countVotedPosition : Int
        positionVoted : [Position!]
    }

    type Candidate{
        _id : ID
        email : String!
        name : String!
        phone: String!
        description : String!
        voteEarned : Int
        uniqueIndex : Int
        positionApplied : ID
    }

    type Position {
        _id : ID
        name : String!
        description : String!
        countofCandidate : Int
        totalVotes : Int
        maxVotes : Int
        slotIndex : Int
        winner : ID
        candidateRegister : [Candidate!]
    }

    type RootQuery{
        getAllPosition : [Position!]
        getCandidateForPosition(PositionId : ID) : [Candidate!]
        getWinner(PositionId : ID) : Candidate
    }

    type UserInput {
        email : String!
        password : String!
    }

    type CandidateInput{
        email : String!
        name : String!
        phone : String!
        description : String!
        positionApplied : ID
    }

    type PositionInput{
        name : String!
        description : String!
        slotIndex : Int!
    }

    type UpdatePositionInput{
        candidateId : ID
        positionId : ID
    }

    type UpdateUserInput {
        email : String!
    }

    type : RootMutation {
        createUser(userInput : UserInput) : User
        createCandidate(candidateInput : CandidateInput) : Candidate
        createPosition(positionInput : PositionInput) Position
        updatePosition(updatePositionInput : UpdatePositionInput) Position
        updateUser(updateUserInput : UpdateUserInput) : User
        afterVoteUpdateUser(PositionId : ID) : User
        afterVoteUpdateCandidate(CandidateId : ID) : Candidate
        afterVoteUpdatePosition(PositionId : ID) : Position
        generateResult(PositionId : ID) : Position
        
    }
    schema{
        query : RootQuery
        mutation : RootMutation
    }
`);

export default schema;
