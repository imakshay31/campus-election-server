import graphql from "graphql";

const schema = graphql.buildSchema(`
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

    input positionInput{
        name : String!
        description : String!
        slotIndex : Int!
    }

    input candidateInput{
        email : String!
        name : String!
        phone : String!
        description : String!
        positionApplied : ID
    }

    input afterVoteInput {
        PositionId : ID
        CandidateId : ID
    }

    type  RootMutation {
        createPosition(positionInput : positionInput) : Position
        createCandidate(candidateInput : candidateInput) : Candidate
        afterVoteUpdateUser(PositionId : ID) : User
        afterVoteUpdateCandidate(CandidateId : ID) : Candidate
        afterVoteUpdatePosition(afterVoteInput : afterVoteInput) : Position
        generateResult(PositionId : ID) : Position
        
    }
    schema{
        query : RootQuery
        mutation : RootMutation
    }
`);

export default schema;
