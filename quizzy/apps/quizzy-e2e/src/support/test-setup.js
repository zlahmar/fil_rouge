"use strict";
/* eslint-disable */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
module.exports = function () {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // Configure axios for tests to use.
        const host = (_a = process.env.HOST) !== null && _a !== void 0 ? _a : 'localhost';
        const port = (_b = process.env.PORT) !== null && _b !== void 0 ? _b : '3000';
        axios_1.default.defaults.baseURL = `http://${host}:${port}`;
    });
};
