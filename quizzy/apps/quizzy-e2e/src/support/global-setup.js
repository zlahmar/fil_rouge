"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable */
var __TEARDOWN_MESSAGE__;
module.exports = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
        console.log('\nSetting up...\n');
        // Hint: Use `globalThis` to pass variables to global teardown.
        globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
    });
};
