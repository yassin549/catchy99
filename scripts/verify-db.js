"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blob_1 = require("@vercel/blob");
var path_1 = __importDefault(require("path"));
// Manually load environment variables
var dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path_1.default.resolve(process.cwd(), '.env.local') });
function verifyDB() {
    return __awaiter(this, void 0, void 0, function () {
        var token, blobs, dbBlob, response, data, admin, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('--- Database Verification Script Started ---');
                    token = process.env.BLOB_READ_WRITE_TOKEN;
                    if (!token) {
                        console.error('ERROR: BLOB_READ_WRITE_TOKEN is not defined in your .env.local file.');
                        console.log('--- Script Finished ---');
                        process.exit(1);
                    }
                    console.log('Successfully loaded BLOB_READ_WRITE_TOKEN.');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    console.log('Attempting to connect to Vercel Blob Storage...');
                    return [4 /*yield*/, (0, blob_1.list)({ prefix: 'db.json', limit: 1, token: token })];
                case 2:
                    blobs = (_a.sent()).blobs;
                    console.log('Connection successful. Checking for db.json...');
                    if (blobs.length === 0) {
                        console.error('ERROR: The database file (db.json) does not exist in your Vercel Blob store.');
                        console.log('Please run `npm run db:init` to create it.');
                        console.log('--- Script Finished ---');
                        return [2 /*return*/];
                    }
                    dbBlob = blobs[0];
                    console.log("Found database file: ".concat(dbBlob.pathname, ", Size: ").concat(dbBlob.size, " bytes."));
                    console.log('Fetching file content...');
                    return [4 /*yield*/, fetch(dbBlob.url)];
                case 3:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch db.json: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    console.log('--- DATABASE CONTENT ---');
                    console.log(JSON.stringify(data, null, 2));
                    console.log('------------------------');
                    if (data.users && data.users.length > 0) {
                        console.log("Found ".concat(data.users.length, " user(s)."));
                        admin = data.users.find(function (u) { return u.email === 'admin@catchy.com'; });
                        if (admin) {
                            console.log('SUCCESS: Admin user (admin@catchy.com) was found.');
                        }
                        else {
                            console.error('ERROR: Admin user (admin@catchy.com) was NOT found in the database!');
                        }
                    }
                    else {
                        console.error('ERROR: The users array in your database is empty or missing!');
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('\n--- VERIFICATION FAILED ---');
                    console.error('An unexpected error occurred:');
                    console.error(error_1);
                    return [3 /*break*/, 6];
                case 6:
                    console.log('--- Script Finished ---');
                    return [2 /*return*/];
            }
        });
    });
}
verifyDB();
