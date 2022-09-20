const resource_name = GetParentResourceName()

addEventListener('message', function(event) {
    if (event.data.open == true) {
        SetupItems(event.data.inputs);
        $('.submit').html(event.data.submitText || 'ACCEPT')
        $('.maincon').css('background-color', event.data.background_color || '#333a44');
        $('.maincon').fadeIn(150, 'swing');
    }
})

document.onkeydown = function(data) {
    if (data.which == 27) {
        $('.maincon').fadeOut(150, 'swing');
        $.post(`https://${resource_name}/close`)
    }
}

$(document).on('click', '.submit', function() {
    let cb = CheckIfRequired()

    if (cb === true) {
        let object = {}
        let inputs = document.getElementsByClassName('optionInput')
        let selects = document.getElementsByClassName('optionSelect')

        for (const input of inputs) {
            // convert to number if it's a number
            if (input.type == 'number') {
                object[input.name] = Number(input.value)
            } else {
                object[input.name] = input.value
            }
        }

        for (const input of selects) object[input.name] = input.value

        $.post(`https://${resource_name}/submit`, JSON.stringify({ object }))
        $('.maincon').fadeOut(150, 'swing');
    } else {
        animation(cb)
    }
})

function animation(element) {
    $('.maincon').append(`<div class="error"> Pls, fill all the requirements!</div>`);
    $('.error').fadeIn(150, 'swing')
    $('.submit').css('color', 'white');
    $('.submit').html('Failed');
    $('.submit').css('background-color', '#ff0000');
    $(element).parent().css('border-bottom', '2px solid rgb(255 0 0 / 60%)');
    setTimeout(() => {
        $('.submit').html('Try Again');
        $(element).parent().css('border-bottom', '2px solid rgba(255, 255, 255, 0.6)');
        $('.error').remove();
        $('.submit').css('color', 'black');
        $('.submit').css('background-color', '#78CE6A');
    }, 2500);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function CheckIfRequired() {
    let inputs = document.getElementsByClassName('optionInput')

    for (const iterator of inputs) {
        let req = $(iterator).parent().attr('data-required')
        if (req == 'true') {
            if (iterator.value == '') {
                return iterator
            }
        }
    }
    return true
}

// some functions grabed from qb-input
const renderTextInput = (item) => {
        try {
            return `<div class="newOption" data-required="${(item.required)}">
                <span class="optionDesc">${item.title || capitalizeFirstLetter(item.name)} ${(item.required) ? '*' : ''}</span>
                ${item.icon ? `<div class="emojiBox"><i class="${item.icon}"></i></div>` : ''}
                <input type="text" placeholder="${item.text || ""}" name="${item.name}" class="optionInput">
            </div>`;
    } catch (err) {
        console.warn(err);
        return "";
    }
};

const renderPasswordInput = (item) => {
    try {
        return `<div class="newOption" data-required="${(item.required)}">
                <span class="optionDesc">${item.title || capitalizeFirstLetter(item.name)} ${(item.required) ? '*' : ''}</span>
                ${item.icon ? `<div class="emojiBox"><i class="${item.icon}"></i></div>` : ''}
                <input type="password" placeholder="${item.text || ""}" name="${item.name}" class="optionInput">
            </div>`;
    } catch (err) {
        console.warn(err);
        return "";
    }
};

const renderNumberInput = (item) => {
    try {
        return `<div class="newOption" data-required="${(item.required)}">
                <span class="optionDesc">${item.title || capitalizeFirstLetter(item.name)} ${(item.required) ? '*' : ''}</span>
                ${item.icon ? `<div class="emojiBox"><i class="${item.icon}"></i></div>` : ''}
                <input type="number" placeholder="${item.text || ""}" name="${item.name}" class="optionInput">
            </div>`;
    } catch (err) {
        console.warn(err);
        return "";
    }
};

const renderSelectInput = (item) => {
    try {
        return `<div class="newOption" data-required="${(item.required)}">
                <span class="optionDesc">${item.title || capitalizeFirstLetter(item.name)} ${(item.required) ? '*' : ''}</span>
                ${item.icon ? `<div class="emojiBox"><i class="${item.icon}"></i></div>` : ''}
                <select name="${item.name}" id="" class="optionSelect">
                    ${GetSelect(item.options)}
                </select>
            </div>`;
    } catch (err) {
        console.warn(err);
        return "";
    }
};

function SetupItems(items) {
    $('.appendablediv').html('')
    for (const item of items) {
        if (item.type == undefined) {
            console.warn('this item is missing its type (', item.name, ')');
            continue
        }
        if (item.required == undefined && item.isRequired == undefined) {
            item.required = false
        } else if (item.isRequired !== undefined) {
            item.required = item.isRequired
        } else {
            item.required = false
        }
        switch (item.type) {
            case "text":
                $('.appendablediv').append(renderTextInput(item))
                break;
            case "password":
                $('.appendablediv').append(renderPasswordInput(item));
                break;
            case "number":
                $('.appendablediv').append(renderNumberInput(item));
                break;
            // case "radio":
            //    $('.appendablediv').append(renderRadioInput(item));
            //     break;
            case "select":
                $('.appendablediv').append(renderSelectInput(item));
                break;
            // case "checkbox":
            //     $('.appendablediv').append(renderCheckboxInput(item));
            //     break;
            default:
                $('.appendablediv').append(renderTextInput(itme));
        }
    }
}

function GetSelect(options) {
    let htmlsorgu = ''
    for (const option of options) {
        htmlsorgu = htmlsorgu + `<option value="${option.value}">${option.text || option.title}</option>`
    }
    return htmlsorgu
}