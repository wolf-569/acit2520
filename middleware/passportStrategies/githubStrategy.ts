import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import dotenv from 'dotenv'
import { getUserByEmailIdAndPassword, getUserById, getUserEmail, checkUserPassword} from "../../controllers/userController";
import { log } from 'console';
import { database } from '../../models/userModel';


dotenv.config();

function findOrCreateUser(profileId: number, name: string) {
    
    let user = database.find((user) => user.id  === profileId);
    if(!user){
        user = {id: profileId, name: name, admin: false};
        database.push(user)
    }
    return user
}

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
    clientID: process.env.GITHUB_CLIENT_ID || (() => { throw new Error('GITHUB_CLIENT_ID is not defined'); })(),
        clientSecret: process.env.GITHUB_CLIENT_SECRET || (() => { throw new Error('GITHUB_CLIENT_SECRET is not defined'); })(),
        callbackURL: "http://127.0.0.1:8000/auth/github/callback",
        passReqToCallback: true,
    }, 

          async (req: any, accessToken: any, refreshToken: any, profile: any, done: any) => {   
            const user = findOrCreateUser(profile.id, profile.username);
            // console.log(database);
            
            // return done(null, user);
            done(null, user);
        }
    );

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
