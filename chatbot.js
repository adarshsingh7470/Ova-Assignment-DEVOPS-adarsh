let apikey = ;
let count = 0; // Added initialization for count variable

document.getElementById('input_icon').addEventListener('click', () => {
    if (document.getElementById('input').value !== '') {
        document.getElementsByClassName('search')[0].style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5), inset 5px 5px 10px rgba(0, 0, 0, 0.5)";
        document.getElementsByClassName('loading')[0].style.display = 'flex';
        document.getElementsByClassName('loading')[0].innerHTML = `<div class="load">
            <h6></h6>
            <h6></h6>
            <h6></h6>
        </div>`;
        document.getElementById('input_icon').style.cursor = 'not-allowed';
        runMessage(document.getElementById('input').value);
    } else {
        document.getElementsByClassName('search')[0].style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.5), inset 5px 5px 10px rgba(255, 0, 0, 0.5)";
    }
});

let offButton = () => {
    Array.from(document.getElementsByClassName('button')).forEach((el) => {
        el.classList.remove('lan');
    });
};
Array.from(document.getElementsByClassName('button')).forEach((el) => {
    el.addEventListener('click', () => {
        offButton();
        el.classList.add('lan');
    });
});

let runMessage = (message) => {
    let lan = document.getElementsByClassName('lan')[0].innerText;
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'user',
                    content :`${message} in ${lan}`,
                    // message + ' in ' + lan,
                },
            ],
            temperature: 0.5,
            max_tokens: 3000
        })
    })
    .then((Response) => Response.json())
    .then((result) => {
        
    // console.log(result.choices[0].message.content)
        messageBox(message, result.choices[0].message.content);
        document.getElementsByClassName('loading')[0].style.display = 'none';
    })
    .catch((err) => {
        document.getElementsByClassName('loading')[0].innerHTML = 'Not found';
    })
    .finally(() => { // Fixed syntax for finally block
        document.getElementById('input').value = '';
        document.getElementById('input_icon').style.cursor = 'pointer';
    });
};

let messageBox = (msg, res) => {
    let myMessageBx = document.createElement('pre');
    myMessageBx.classList.add('qus_box');
    let myMessage = document.createElement('p');
    myMessage.innerText = msg;
    myMessageBx.append(myMessage);
    document.getElementById('history').append(myMessageBx);

    let ansMessageBx = document.createElement('pre');
    ansMessageBx.classList.add('ans_box');
    let ansMessage = document.createElement('p');
    ansMessage.innerText = res;
    ansMessageBx.id = 'ans' + count;
    let copyIcon = document.createElement('i');
    copyIcon.className = 'bi bi-clipboard2';
    copyIcon.id = 'copy' + count;
    ansMessageBx.append(copyIcon);
    ansMessageBx.append(ansMessage);
    document.getElementById('history').append(ansMessageBx);

    copyIcon.onclick = () => {
        inputCopy(ansMessageBx.id);
        copyIcon.classList.remove('bi bi-clipboard2');
        copyIcon.classList.add('bi bi-clipboard-check');
        setTimeout(() => {
            copyIcon.classList.add('bi bi-clipboard2');
            copyIcon.classList.remove('bi bi-clipboard-check');
        }, 3000);
    };

    count++;
};

const inputCopy = (id) => {
    let message = document.getElementById(id).innerText;
    navigator.clipboard.writeText(message);
};
