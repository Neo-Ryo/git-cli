import boxen from 'boxen';
import chalk from 'chalk';
import { argv, exit, stdin, stdout } from 'process';
import rdl from 'readline';
const args = process.argv;

export const options = [
    { name: 'help', cmd: '--help', alias: '-h' },
    { name: 'delete branches', cmd: '--delete-branch', alias: '-db' },
    { name: 'show branches', cmd: '--show-branch', alias: '-sb' },
];

export class Select {
    constructor(
        opts = {
            question: 'How u doin?',
            options: ['Fine!', 'Bad...'],
            answers: ['OK'],
            pointer: '>',
            color: (color, text) => chalk[color](text),
        }
    ) {
        let { question, options, answers, pointer, color } = opts;
        this.question = question;
        this.options = options;
        this.answers = answers;
        this.pointer = pointer;
        this._color = color;
        this.input;
        this.cursorLocs = {
            x: 0,
            y: 0,
        };
    }

    start() {
        stdout.write(this.question + '\n');
        for (let opt = 0; opt < this.options.length; opt++) {
            this.options[opt] = this.pointer + ' ' + this.options[opt];
            if (opt === this.options.length - 1) {
                this.input = this.options.length - 1;
                this.options[opt] += '\n';
                stdout.write(this.color(this.options[opt], this._color));
            } else {
                this.options[opt] += '\n';
                stdout.write(this.options[opt]);
            }
            this.cursorLocs.y = opt + 1;
        }
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf-8');
        this.hideCursor();
        stdin.on('data', this.pn(this));
    }

    // to hide cursor we write '\x1B[?25l' to stdout stream
    hideCursor() {
        stdout.write('\x1B[?25l');
    }

    pn(self) {
        return (c) => {
            console.log(c);
            switch (c) {
                case '\u0004': // Ctrl-d
                case '\r':
                case '\n':
                    return self.enter();
                case '\u0003': // Ctrl-c
                    return self.ctrlc();
                case '\u001b[A':
                    return self.upArrow();
                case '\u001b[B':
                    return self.downArrow();
            }
        };
    }

    upArrow() {
        let y = this.cursorLocs.y;
        rdl.cursorTo(stdout, 0, y);
        stdout.write(this.options[y - 1]);
        if (this.cursorLocs.y === 1) {
            this.cursorLocs.y = this.options.length;
        } else {
            this.cursorLocs.y--;
        }
        y = this.cursorLocs.y;
        rdl.cursorTo(stdout, 0, y);
        stdout.write(this.color(this.options[y - 1], this._color));
        this.input = y - 1;
    }

    color(str, colorName = 'yellow') {
        return chalk[colorName](str);
    }

    downArrow() {
        let y = this.cursorLocs.y;
        rdl.cursorTo(stdout, 0, y);
        stdout.write(this.options[y - 1]);
        if (this.cursorLocs.y === this.options.length) {
            this.cursorLocs.y = 1;
        } else {
            this.cursorLocs.y++;
        }
        y = this.cursorLocs.y;
        rdl.cursorTo(stdout, 0, y);
        stdout.write(this.color(this.options[y - 1], this._color));
        this.input = y - 1;
    }

    enter() {
        stdin.removeListener('data', this.pn);
        stdin.setRawMode(false);
        // stdin.pause();
        // this.showCursor();
        rdl.cursorTo(stdout, 0, this.options.length + 1);
        console.log(this.answers[this.input]);
        exit();
    }
    ctrlc() {
        stdin.removeListener('data', this.pn);
        stdin.setRawMode(false);
        stdin.pause();
        this.showCursor();
    }

    showCursor() {
        stdout.write('\x1B[?25h');
    }
}
