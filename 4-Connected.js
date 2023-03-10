//for the look
const human_button = document.getElementsByClassName("vs-human")[0];
const robot_button = document.getElementsByClassName("vs-robot")[0];
const start_button = document.getElementsByClassName("start")[0];
const difficulty_section = document.getElementsByClassName("difficulty-section")[0];
const time = document.getElementsByClassName("time")[0];
const lines = document.getElementsByClassName("line");
const AI = 2;
const HUMAN = 1;
let pll = AI;
let game_time = [0, 0];
let count_down_interval;
let start_ind = true;
let matrix = new Array(6);
let winning_chain = [[0, 0], [0, 0], [0, 0], [0, 0]];
let blinking_counter = 6;
let swap = 1;
let animation_swap = 1;
for (let i = 0; i < 6; i++) matrix[i] = new Array(7);


console.log(window.innerHeight);
console.log(window.innerHeight);

for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) matrix[i][j] = 0;

let [human, robot, easy, meduim, hard, start] = [
    true,
    false,
    true,
    false,
    false,
    false,
];

//AI

let winner = 0;
let dx = [0, 0, 1, -1, -1, 1, -1, 1];
let dy = [-1, 1, -1, 1, -1, 1, 0, 0];
let turns = 0;

const isValid = (x, y) => {
    return x >= 0 && x < 6 && y >= 0 && y < 7;
};

const shift = (arr) => {
    for (let i = 0; i < 3; i++) {
        arr[i] = arr[i + 1];
    }
}

const check = (x, y, state) => {
    let color = state[x][y];
    let count;
    for (let i = 0; i < 8; i++) {
        if (i % 2 == 0) count = 0;
        else {
            count -= 1;
            shift(winning_chain);
        }
        let newX = x;
        let newY = y;
        while (isValid(newX, newY) && state[newX][newY] == color && count < 4) {
            winning_chain[count] = [newX, newY];
            count++;
            newX += dx[i];
            newY += dy[i];
        }
        if (count >= 4) return color;
    }
    return 0;
};

const calc_three = (x, y, state, color) => {
    let count = 0;
    for (let i = 0; i < 8; i++) {
        let newX = x;
        let newY = y;
        for (let j = 0; j < 3; j++) {
            newX += dx[i];
            newY += dy[i];
            if (!isValid(newX, newY)) break;
            else if (j < 2 && state[newX][newY] != color) break;
            else if (j == 2 && state[newX][newY] != 0) break;
            else if (j == 2) count++;
        }
    }
    return count;
};

const calc_two = (x, y, state, color) => {
    let count = 0;
    for (let i = 0; i < 8; i++) {
        let newX = x;
        let newY = y;
        for (let j = 0; j < 2; j++) {
            newX += dx[i];
            newY += dy[i];
            if (!isValid(newX, newY)) break;
            else if (j < 1 && state[newX][newY] != color) break;
            else if (j == 1 && state[newX][newY] != 0) break;
            else if (j == 1) count++;
        }
    }
    return count;
};

const evaluation = (state) => {
    let countR = 0;
    let countB = 0;
    for (let i = 0; i < 6; i++)
        for (let j = 0; j < 7; j++) {
            let color = state[i][j];
            if (color == 0) continue;
            for (let k = 0; k < 8; k++) {
                if (
                    isValid(i + 3 * dx[k], j + 3 * dy[k]) &&
                    state[i + dx[k]][j + dy[k]] == color &&
                    state[i + 2 * dx[k]][j + 2 * dy[k]] == color &&
                    state[i + 3 * dx[k]][j + 3 * dy[k]] == 0
                )
                    if (color == AI) countR += 100;
                    else countB += 100;
                else if (
                    isValid(i + 2 * dx[k], j + 2 * dy[k]) &&
                    state[i + dx[k]][j + dy[k]] == color &&
                    state[i + 2 * dx[k]][j + 2 * dy[k]] == 0
                )
                    if (color == AI) countR++;
                    else countB++;
            }
        }
    return countR - countB;
};
const calc = (x, y, color, state, visited) => {
    if (state[x][y] != color && state[x][y] != 0) return 0;
    let res = 0;
    for (let i = 0; i < 8; i++) {
        let newX = x;
        let newY = y;
        for (let j = 0; j < 3; j++) {
            newX += dx[i];
            newY += dy[i];
            if (!isValid(newX, newY)) break;
            if (state[newX][newY] != color && state[newX][newY] != 0) break;
            if (j == 2 && !visited[newX][newY]) res++;
        }
    }
    visited[x][y] = true;
    return res;
};

const is_game_over = (state) => {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            let f = check(i, j, state);
            if (f != 0) return [1, f];
        }
    }
    for (let i = 0; i < 7; i++) {
        if (state[5][i] == 0) return [0, 0];
    }
    return [1, 0];
};

const alphabeta = (state, depth, alpha, beta, maximizingPlayer) => {
    let [is_terminal, win] = is_game_over(state);

    if (is_terminal) {
        if (win == 0) return [-1, 0];
        if (win == HUMAN) return [-1, -99998 * Math.pow(10, depth)];
        if (win == AI) return [-1, 99999 * Math.pow(10, depth)];
    }
    if (depth == 0) {
        return [-1, evaluation(state), 0];
    }

    if (maximizingPlayer) {
        let v = [-1, -999980000]; // index, value, depth
        for (let i = 0; i < 7; i++) {
            if (state[5][i] == 0) {
                // possibe child
                let child = JSON.parse(JSON.stringify(state));
                for (let j = 0; j < 6; j++) {
                    if (child[j][i] == 0) {
                        child[j][i] = AI;
                        break;
                    }
                }

                let f = alphabeta(child, depth - 1, alpha, beta, false);
                if (depth == 5) {
                    console.log("child " + i + ": " + f[1] + "\n");
                }
                if (v[0] == -1 || f[1] > v[1]) {
                    v[0] = i;
                    v[1] = f[1];
                    alpha = f[1];
                }
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return v;
    } else {
        let v = [-1, 999990000, -1]; // index, value , depth
        for (let i = 0; i < 7; i++) {
            if (state[5][i] == 0) {
                // possibe child
                let child = JSON.parse(JSON.stringify(state));
                for (let j = 0; j < 6; j++) {
                    if (child[j][i] == 0) {
                        child[j][i] = HUMAN;
                        break;
                    }
                }
                let f = alphabeta(child, depth - 1, alpha, beta, true);
                if (v[0] == -1 || f[1] < v[1]) {
                    v[0] = i;
                    v[1] = f[1];
                    beta = f[1];
                }
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return v;
    }
};

const random_move = () => {
    let found = false;
    let rand_index;
    while (!found) {
        rand_index = Math.floor(Math.random() * 7);
        if (matrix[5][rand_index] == 0) {
            found = true;
        }
    }
    setIndex(rand_index);
};

const AI_Move = () => {
    turns = turns + 1;
    let [index, value] = alphabeta(matrix, 5, -1000000000, 1000000000, true);
    turns = turns + 1;
    //console.log("index = " + index + "  value = " + value);
    setIndex(index);
};

const easy_mode = () => {
    if (swap < 2) {
        AI_Move();
        swap++;
    } else {
        random_move();
        swap = 1;
    }
};

const medium_mode = () => {
    if (swap < 3) {
        AI_Move();
        swap++;
    } else {
        random_move();
        swap = 1;
    }
};

const hard_mode = () => {
    AI_Move();
};

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function robot_turn() {
    for (let i = 0; i < 7; i++) {
        let new_line = lines[i].cloneNode(true);
        lines[i].parentNode.replaceChild(new_line, lines[i]);
    
        lines[i].addEventListener("mouseover", function () {
            if (start) {
                if (matrix[5][i] == 0)
                    lines[i].style.backgroundColor = "var(--pointSelection)";
                else lines[i].style.backgroundColor = "var(--robot)";
            }
        });
    
        lines[i].addEventListener("mouseout", function () {
            lines[i].style.backgroundColor = "var(--background)";
        });
    }
    await delay(500);

    if (hard) {
        hard_mode();
    } else if (easy) {
        easy_mode();
    } else if (meduim) {
        medium_mode();
    }

    for (let i = 0; i < 7; i++) {
        lines[i].addEventListener("click", function () {
            let index = $(this).index();
            click_action(index);
        });
    }
};

const go_default = (s = false, h = true, e = true, m = false) => {
    if (!s) {
        start_ind = true;
        start_button.children[0].innerHTML = "Start";
        if (h) {
            human = true;
            robot = false;
            human_button.style.backgroundColor = "var(--human-selected)";
            robot_button.style.backgroundColor = "var(--robot)";
            difficulty_section.classList.add("hidden");
        } else {
            human = false;
            robot = true;
            human_button.style.backgroundColor = "var(--human)";
            robot_button.style.backgroundColor = "var(--robot-selected)";
            difficulty_section.classList.remove("hidden");
            difficulty_section.children[0].children[0].style.transform =
                "matrix(2, 0, 0, 2, 0, -20)";
            difficulty_section.children[1].children[0].style.transform =
                "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[2].children[0].style.transform =
                "matrix(1, 0, 0, 1, 0, 0)";
        }

        if (e) {
            [easy, meduim, hard] = [true, false, false];
            difficulty_section.children[0].children[0].style.transform =
                "matrix(2, 0, 0, 2, 0, -20)";
            difficulty_section.children[1].children[0].style.transform =
                "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[2].children[0].style.transform =
                "matrix(1, 0, 0, 1, 0, 0)";
        } else if (m) {
            [easy, meduim, hard] = [false, true, false];
            difficulty_section.children[0].children[0].style.transform =
                "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[1].children[0].style.transform =
                "matrix(2, 0, 0, 2, 0, -20)";
            difficulty_section.children[2].children[0].style.transform =
                "matrix(1, 0, 0, 1, 0, 0)";
        } else {
            [easy, meduim, hard] = [false, false, true];
            difficulty_section.children[0].children[0].style.transform =
                "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[1].children[0].style.transform =
                "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[2].children[0].style.transform =
                "matrix(2, 0, 0, 2, 0, -20)";
        }
    } else {
        start = true;
        if (start_ind) {
            start_button.style.backgroundColor = "var(--stop)";
            start_button.children[0].innerHTML = "Stop";
            start_ind = false;
        }
    }
};

const start_timer = (start) => {
    let seconds, minutes;
    if (start) {
        let start_time = new Date().getTime();
        count_down_interval = setInterval(function () {
            let now = new Date().getTime();
            let distance = now - start_time;
            minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            seconds = Math.floor((distance % (1000 * 60)) / 1000);
            seconds = seconds.toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
            });
            start_button.children[0].innerHTML =
                "Stop " + minutes + ":" + seconds;
            game_time = [minutes, seconds];
        }, 1000);
    } else {
        clearInterval(count_down_interval);
        start_button.style.backgroundColor = "var(--start)";
    }
};

const fill = (x, y, color) => {
    if (color == HUMAN)
        lines[y].children[x].children[0].style.backgroundColor =
            "var(--human-selected)";
    else if (color == AI)
        lines[y].children[x].children[0].style.backgroundColor =
            "var(--robot-selected)";
    else
        lines[y].children[x].children[0].style.backgroundColor =
            "var(--background)";
};

const winner_boxs = (x, y, clear) => {
    if (clear) {
        lines[y].children[x].style.backgroundColor =
            "var(--pointColors)";
    } else
        lines[y].children[x].style.backgroundColor =
            "var(--winning-line)";
}


const blinking = (winner) => {
    if (blinking_counter > 0) {
        animation_swap = 1 - animation_swap;
        for (let i = 0; i < 4; i++) {
            if (animation_swap == 1) {
                fill(5 - winning_chain[i][0], winning_chain[i][1], -1);
            }
            else {
                fill(5 - winning_chain[i][0], winning_chain[i][1], winner);
            }
        }
        blinking_counter = blinking_counter - 1;
    }

}

let interval;

const winning_animation = (winner) => {
    if (winner == HUMAN && human) {
        alert("Player 1 won in " + game_time[0] + ":" + game_time[1]);
    } else if (winner == AI && human) {
        alert("Player 2 won in " + game_time[0] + ":" + game_time[1]);
    } else if (winner == AI) {
        alert("AI won in " + game_time[0] + ":" + game_time[1]);
    } else
        alert("You won in " + game_time[0] + ":" + game_time[1]);

    for (let i = 0; i < 4; i++)
        winner_boxs(5 - winning_chain[i][0], winning_chain[i][1], false);

    animation_swap = 0;
    interval = setInterval(blinking, 750, winner);
}

const setIndex = (index) => {
    let i;
    pll = 3 - pll;
    for (i = 0; i < 6; i++) {
        if (matrix[i][index] == 0) {
            matrix[i][index] = pll;
            fill(5 - i, index, pll);
            winner = check(i, index, matrix);
            if (winner != 0) {
                winning_animation(winner);
                start_action(false);
            }
            break;
        }
    }
};

let player_swap = 1;

const start_action = (clear) => {
    if (clear) {
        blinking_counter = 6;
        swap = 1;
        animation_swap = 1;
        clearInterval(interval);
        for (let i = 0; i < 4; i++)
            winner_boxs(5 - winning_chain[i][0], winning_chain[i][1], true);
        for (let i = 0; i < 6; i++)
            for (let j = 0; j < 7; j++) {
                lines[j].children[i].children[0].style.backgroundColor =
                    "var(--background)";
                matrix[i][j] = 0;
            }
        if (!start) {
            player_swap = 1 - player_swap;
            if (player_swap == 0) {
                pll = AI;
            } else if (player_swap == 1 && human)
                pll = HUMAN;
            else if (player_swap == 1) {
                pll = HUMAN;
                robot_turn();
            }
        }
    }
    start = !start;
    start_timer(start);
    go_default(start, human, easy, meduim);
    winner = 0;
};

human_button.addEventListener("click", function () {
    go_default(start, true);
});

robot_button.addEventListener("click", function () {
    go_default(start, false);
});

start_button.addEventListener("click", function () {
    start_action(true);
});

start_button.addEventListener("mouseover", function () {
    if (start) start_button.style.backgroundColor = "var(--stop-selected)";
    else start_button.style.backgroundColor = "var(--start-selected)";
});

start_button.addEventListener("mouseout", function () {
    if (start) start_button.style.backgroundColor = "var(--stop)";
    else start_button.style.backgroundColor = "var(--start)";
});

difficulty_section.children[0].addEventListener("click", function () {
    go_default(start, human);
});

difficulty_section.children[1].addEventListener("click", function () {
    go_default(start, human, false, true);
});

difficulty_section.children[2].addEventListener("click", function () {
    go_default(start, human, false, false);
});

// function sleep(milliseconds) {
//     const date = Date.now();
//     let currentDate = null;
//     do {
//       currentDate = Date.now();
//     } while (currentDate - date < milliseconds);
//   }

const click_action = (index) => {
    if (start) {
        if (human) setIndex(index);
        else if (!human && winner == 0) {
            setIndex(index);
            if (winner == 0) robot_turn();
        }
        if (winner != 0) start_action(false);
        console.log(evaluation(matrix));
    }
}

for (let i = 0; i < 7; i++) {
    lines[i].addEventListener("click", function () {
        let index = $(this).index();
        click_action(index);
    });

    lines[i].addEventListener("mouseover", function () {
        if (start) {
            if (matrix[5][i] == 0)
                lines[i].style.backgroundColor = "var(--pointSelection)";
            else lines[i].style.backgroundColor = "var(--robot)";
        }
    });

    lines[i].addEventListener("mouseout", function () {
        lines[i].style.backgroundColor = "var(--background)";
    });
}