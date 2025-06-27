import { app } from "electron";
import { DiscordBroker } from "./discordIPCBroker";

import path from "path";

import * as fs from "fs" 






export class DiscordManager{
    broker: DiscordBroker;

    constructor() {
        this.broker = new DiscordBroker(this);

    }



}