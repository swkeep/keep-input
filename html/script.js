const resource_name = GetParentResourceName()

addEventListener('message', function(event) {
    if (event.data.open == true) {
        SetupItems(event.data.inputs);
        $('.submit').html(event.data.submitText || 'ACCEPT')
        $('.maincon').css('background-color', event.data.background_color || '#333a44');
        $('.maincon').fadeIn(150, 'swing');
    }
})

document.onkeydown = function(event) {
    if (event.code == 'Escape') {
        $('.maincon').fadeOut(150, 'swing');
        $.post(`https://${resource_name}/close`)
    }
}

const submit = () => {
    let cb = CheckIfRequired()
    if (cb === true) {
        let object = {}
        let inputs = document.getElementsByClassName('optionInput')
        let selects = document.getElementsByClassName('optionSelect')
        let radiobox = document.getElementsByClassName('form-radio')
        let checkbox = document.getElementsByClassName('form-checkbox')
        for (const input of inputs) {
            // convert to number if it's a number
            if (input.type == 'number') {
                object[input.name] = Number(input.value)
            } else {
                object[input.name] = input.value
            }
        }

        for (const input of selects) object[input.name] = input.value

        for (const radio of radiobox) {
            for (const iterator of radio.childNodes) {
                if (iterator.childNodes.length > 0 && (iterator.childNodes[0].checked)) {
                    object[iterator.childNodes[0].name] = iterator.childNodes[0].value
                    break
                }
            }
        }

        for (const check of checkbox) {
            for (const iterator of check.childNodes) {
                if (iterator.childNodes.length > 0) {
                    let name = iterator.childNodes[0].name
                    let value = iterator.childNodes[0].value
                    if (!object[name]) object[name] = {}
                    object[name][value] = iterator.childNodes[0].checked
                }
            }
        }

        $.post(`https://${resource_name}/submit`, JSON.stringify({ object }))
        $('.maincon').fadeOut(150, 'swing');
    } else {
        animation(cb)
    }
}

document.addEventListener("keyup", function(event) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        submit()
    }
});

$(document).on('click', '.submit', function() {
    submit()
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
                <input type="text" placeholder="${item.text || ""}" name="${item.name}" class="optionInput ${item.disabled ? 'disabled' : ''}" ${item.disabled ? 'disabled' : ''} value ="${item.force_value || ''}">
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
                <input type="password" placeholder="${item.text || ""}" name="${item.name}" class="optionInput ${item.disabled ? 'disabled' : ''}" ${item.disabled ? 'disabled' : ''}>
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
                <input type="number" placeholder="${item.text || ""}" name="${item.name}" class="optionInput ${item.disabled ? 'disabled' : ''}" ${item.disabled ? 'disabled' : ''} value ="${item.force_value || 0}">
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

const renderRadioInput = (item) => {
    return `<div class="newRadio" data-required="${(item.required)}">
                <span class="optionDesc">${item.title || capitalizeFirstLetter(item.name)} ${(item.required) ? '*' : ''}</span>
                ${item.icon ? `<div class="emojiBox"><i class="${item.icon}"></i></div>` : ''}
                <div class="optionRadio">
                ${GetRadio(item.name, item.options, item.default)}
                </div>
            </div>`;
};

const renderCheckboxInput = (item) => {
    return `<div class="newCheckBox" data-required="${(item.required)}">
                <span class="optionDesc">${item.title || capitalizeFirstLetter(item.name)} ${(item.required) ? '*' : ''}</span>
                ${item.icon ? `<div class="emojiBox"><i class="${item.icon}"></i></div>` : ''}
                <div class="optionCheckBox">
                ${GetCheckBox(item.name, item.options, item.default)}
                </div>
            </div>`;
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
            case "radio":
                $('.appendablediv').append(renderRadioInput(item));
                break;
            case "select":
                $('.appendablediv').append(renderSelectInput(item));
                break;
            case "checkbox":
                $('.appendablediv').append(renderCheckboxInput(item));
                break;
            default:
                $('.appendablediv').append(renderTextInput(itme));
        }
    }
}

function GetSelect(options) {
    let html = ''
    for (const option of options) {
        html = html + `<option class="${option.disabled ? 'disabled' : ''}" ${option.disabled ? 'disabled' : ''} value="${option.value}">${option.text || option.title}</option>`
    }
    return html
}

function GetRadio(name, options, default_item) {
    let html = '<div class="form-radio">'
    for (const option of options) {
        let id = generateId(20)
        html = html + `
        <label><input type="radio" id="${option.text + '-' + id}" name="${name}" value="${option.value}" ${(default_item == option.value) ? "checked" : ""} ${option.disabled ? 'disabled' : ''}>${option.text}</label>         
        `
    }
    html += '</div>'
    return html
}

function GetCheckBox(name, options, default_item) {
    let html = '<div class="form-checkbox">'
    for (const option of options) {
        let id = generateId(20)
        html = html + `
            <label><input type="checkbox" id="${option.text + '-' + id}" name="${name}" value="${option.value}" ${(default_item == option.value) ? "checked" : ""} ${option.disabled ? 'disabled' : ''}>${option.text}</label>      
        `
    }
    html += '</div>'
    return html
}

function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0")
}

function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}