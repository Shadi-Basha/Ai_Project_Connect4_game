//for the look

const human_button = document.getElementsByClassName("vs-human")[0];
const robot_button = document.getElementsByClassName("vs-robot")[0];
const start_button = document.getElementsByClassName("start")[0];
const difficulty_section = document.getElementsByClassName("difficulty-section")[0];
const time = document.getElementsByClassName("time")[0];
let count_down_interval;
let start_ind = true;

let [human, robot, easy, meduim, hard, start] = [true, false, true, false, false, false];

const go_default = (s = false,h = true, e = true, m = false) => {
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
    }else{
        start = true;
        if(start_ind){
            start_button.style.backgroundColor = "var(--stop)";
            start_button.children[0].innerHTML = "Stop";
            start_ind = false;
        }
    }

}


const start_timer = (start) =>{

    if(start){
        let start_time = new Date().getTime();
        count_down_interval = setInterval(function(){
            let now = new Date().getTime();
            let distance = now - start_time;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            seconds = seconds.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
              })
            start_button.children[0].innerHTML = "Stop " + minutes + ":" + seconds;
        },1000);

    }else
        clearInterval(count_down_interval);
}

human_button.addEventListener("click", function () {
    go_default(start,true);
});

robot_button.addEventListener("click", function () {
    go_default(start,false);
});

start_button.addEventListener("click", function(){
    start = !start;
    start_timer(start);
    go_default(start,human,easy,meduim);
});

start_button.addEventListener("mouseover", function(){
    if(start)
        start_button.style.backgroundColor = "var(--stop-selected)";
    else
        start_button.style.backgroundColor = "var(--start-selected)";

});

start_button.addEventListener("mouseout", function(){
    if(start)
        start_button.style.backgroundColor = "var(--stop)";
    else
        start_button.style.backgroundColor = "var(--start)";

});

difficulty_section.children[0].addEventListener("click", function () {
    go_default(start,human);
});

difficulty_section.children[1].addEventListener("click", function () {

    go_default(start,human, false, true);
});

difficulty_section.children[2].addEventListener("click", function () {
    
    go_default(start,human, false, false);
});


