#! /usr/bin/env node
import chalk from 'chalk';
import boxen from 'boxen';
import { options, Select } from './options.js';
import { argv, exit, stdin, stdout } from 'process';
import { exec } from 'child_process';

const args = process.argv;

const foundArgs = args.filter((arg) =>
    options.find((el) => el.cmd === arg || el.alias === arg)
);

const jsFrameworkSel = new Select({
    question: boxen('What do you wish to do?', { borderStyle: 'round' }),
    options: [
        boxen('checkout', { backgroundColor: 'cyan' }),
        'delete branch',
        'rename branch',
        'just curious',
    ],
    answers: [
        "let's checkout",
        "let's delete some branches",
        "let's rename them all!",
        'Happy to have had your attention 💚',
    ],
    pointer: '>',
    color: 'green',
});

jsFrameworkSel.start();
