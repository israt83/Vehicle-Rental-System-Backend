import { Express } from './../../node_modules/@types/express-serve-static-core/index.d';
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload ;
            
        }
    }
}



