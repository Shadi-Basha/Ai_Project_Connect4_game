//for the look
const human_button = document.getElementsByClassName("vs-human")[0];
const robot_button = document.getElementsByClassName("vs-robot")[0];
const start_button = document.getElementsByClassName("start")[0];
const difficulty_section = document.getElementsByClassName("difficulty-section")[0];
const time = document.getElementsByClassName("time")[0];
const lines = document.getElementsByClassName("line");
let p = 2;
let count_down_interval;
let start_ind = true;
let matrix = new Array(6);
for (let i = 0; i < 6; i++)
    matrix[i] = new Array(7);

for (let i = 0; i < 6; i++)
    for (let j = 0; j < 7; j++)
        matrix[i][j] = 0;

let [human, robot, easy, meduim, hard, start] = [true, false, true, false, false, false];


//AI

let winner = 0;
let dx = [0, 0, 1, -1, -1, 1, -1, 1];
let dy = [-1, 1, -1, 1, -1, 1, 0, 0];

const isValid = (x, y) => {
    return x >= 0 && x < 6 && y >= 0 && y < 7;
}

const check = (x, y, state) => {
    let color = state[x][y];
    let count;
    for (let i = 0; i < 7; i++) {
        if (i % 2 == 0) count = 0;
        else count -= 1;
        let newX = x;
        let newY = y;
        while (isValid(newX, newY) && state[newX][newY] == color && count < 4) {
            count++;
            newX += dx[i];
            newY += dy[i];
        }
        if (count >= 4) return color;
    }
    return 0;
}



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
}

const evaluation = (state) => {
    let visited = new Array(6);
    for (let i = 0; i < 6; i++) {
        visited[i] = new Array(7);
    }

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            visited[i][j] = false;
        }
    }
    let win2 = 0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (state[i][j] != 0)
                win2 += calc(i, j, 2, state, visited);
        }
    }

    let win1 = 0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            visited[i][j] = false;
        }
    }
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (state[i][j] != 0)
                win1 += calc(i, j, 1, state, visited);
        }
    }

    return win2 - win1;
}

const isFinalState = (state) => {
    for (let i = 0; i < 7; i++) {
        if (state[5][i] == 0) return false; // if have column not full
    }
    return true;
}

const check_all = (state) => {
    let j;
    for (let i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            let f = check(i, j, state);
            if (f != 0) return [f, j];
        }
    }
    return [0, 0];
}

const alphabeta = (state, depth, alpha, beta, maximizingPlayer) => {

    let res = check_all(state);
    if (depth == 0 || isFinalState(state) || res[0] != 0) {
        if (res[0] == 0)
            return [res[1], evaluation(state)];
        else {
            if (res[0] == 2) return [res[1], Infinity];
            else if (res[0] == 1) return [res[1], -Infinity];
        }
    }

    if (maximizingPlayer) {
        let v = [-1, -Infinity]; // index, value
        for (let i = 0; i < 7; i++) {
            if (state[5][i] == 0) { // possibe child
                // let child = Object.assign({}, state);
                let child = JSON.parse(JSON.stringify(state));
                for (let j = 0; j < 6; j++) {
                    if (child[j][i] == 0) {
                        child[j][i] = 2;
                        break;
                    }
                }
                let f = alphabeta(child, depth - 1, alpha, beta, false);
                if (f[1] > v[1]) {
                    v[0] = i;
                    v[1] = f[1];
                }
                alpha = Math.max(alpha, v[1]);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return v;
    }
    else {
        let v = [-1, Infinity]; // index, value
        for (let i = 0; i < 7; i++) {
            if (state[5][i] == 0) { // possibe child
                //let child = Object.assign({}, state);
                let child = JSON.parse(JSON.stringify(state));
                for (let j = 0; j < 6; j++) {
                    if (child[j][i] == 0) {
                        child[j][i] = 1;
                        break;
                    }
                }
                let f = alphabeta(child, depth - 1, alpha, beta, true);
                if (f[1] < v[1]) {
                    v[0] = i;
                    v[1] = f[1];
                }
                beta = Math.min(beta, v[1]);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return v;
    }
}


const hard_mode = () => {
    let [index, value] = alphabeta(matrix, 4, -Infinity, Infinity, true);
    console.log(index);
    setIndex(index);
}

const easy_mode = () => {
    let found = false;
    let rand_index;
    while (!found) {
        rand_index = Math.floor(Math.random() * 7);
        if (matrix[5][rand_index] == 0) {
            found = true;
        }
    }
    setIndex(rand_index);
}

let swap = false;

const meduim_mode = () => {
    swap = !swap;
    if (swap) {
        hard_mode();
    } else
        easy_mode();
}

const robot_turn = () => {
    if (hard) {
        hard_mode();
    } else if (easy) {
        easy_mode();
    } else if (meduim) {
        meduim_mode();
    }
}

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
        }
        else {
            human = false;
            robot = true;
            human_button.style.backgroundColor = "var(--human)";
            robot_button.style.backgroundColor = "var(--robot-selected)";
            difficulty_section.classList.remove("hidden");
            difficulty_section.children[0].children[0].style.transform = "matrix(2, 0, 0, 2, 0, -20)";
            difficulty_section.children[1].children[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[2].children[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)";
        }

        if (e) {
            [easy, meduim, hard] = [true, false, false];
            difficulty_section.children[0].children[0].style.transform = "matrix(2, 0, 0, 2, 0, -20)";
            difficulty_section.children[1].children[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[2].children[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)";
        }
        else if (m) {
            [easy, meduim, hard] = [false, true, false];
            difficulty_section.children[0].children[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[1].children[0].style.transform = "matrix(2, 0, 0, 2, 0, -20)";
            difficulty_section.children[2].children[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)";
        }
        else {
            [easy, meduim, hard] = [false, false, true];
            difficulty_section.children[0].children[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[1].children[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)";
            difficulty_section.children[2].children[0].style.transform = "matrix(2, 0, 0, 2, 0, -20)";
        }
    } else {
        start = true;
        if (start_ind) {
            start_button.style.backgroundColor = "var(--stop)";
            start_button.children[0].innerHTML = "Stop";
            start_ind = false;
        }
    }

}


const start_timer = (start) => {

    if (start) {
        let start_time = new Date().getTime();
        count_down_interval = setInterval(function () {
            let now = new Date().getTime();
            let distance = now - start_time;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            seconds = seconds.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            })
            start_button.children[0].innerHTML = "Stop " + minutes + ":" + seconds;
        }, 1000);

    } else
        clearInterval(count_down_interval);
}


const fill = (x, y, color) => {
    if (color == 1)
        lines[y].children[x].children[0].style.backgroundColor = "var(--human-selected)";
    else
        lines[y].children[x].children[0].style.backgroundColor = "var(--robot-selected)";
}

const setIndex = (index) => {
    let i;
    for (i = 0; i < 6; i++) {
        if (matrix[i][index] == 0) {
            matrix[i][index] = p;
            break;
        }
    }
    if (i < 6) {
        if (p == 2) p = 1;
        else p = 2;
        fill(5 - i, index, p);
        winner = check(i, index, matrix);
    }
}

const start_action = (clear) => {
    if (clear) {
        for (let i = 0; i < 6; i++)
            for (let j = 0; j < 7; j++) {
                lines[j].children[i].children[0].style.backgroundColor = "var(--background)";
                matrix[i][j] = 0;
            }
    }
    start = !start;
    start_timer(start);
    go_default(start, human, easy, meduim);
    p = 2;
    winner = 0;
}



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
    if (start)
        start_button.style.backgroundColor = "var(--stop-selected)";
    else
        start_button.style.backgroundColor = "var(--start-selected)";

});

start_button.addEventListener("mouseout", function () {
    if (start)
        start_button.style.backgroundColor = "var(--stop)";
    else
        start_button.style.backgroundColor = "var(--start)";

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


for (let i = 0; i < 7; i++) {
    lines[i].addEventListener("click", function () {
        if (start) {
            if (human)
                setIndex($(this).index());
            else if (!human && winner == 0) {
                setIndex($(this).index());
                if (winner == 0)
                    robot_turn();
            }
            if (winner != 0)
                start_action(false);
        }
    });

    lines[i].addEventListener("mouseover", function () {
        if (start) {
            if (matrix[5][i] == 0)
                lines[i].style.backgroundColor = "var(--pointSelection)";
            else
                lines[i].style.backgroundColor = "var(--robot)";
        }

    });

    lines[i].addEventListener("mouseout", function () {
        lines[i].style.backgroundColor = "var(--background)";
    });

};










