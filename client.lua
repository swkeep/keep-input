local opened = false
local Promise = nil
local resource_name = GetCurrentResourceName()

local function closeInput(reason)
    Promise:resolve({ {}, reason })
    Promise = nil
    SetNuiFocus(false, false)
    opened = false
    Wait(1)
end

RegisterNUICallback('close', function()
    closeInput('user')
end)

RegisterNUICallback('submit', function(data)
    Promise:resolve({ data.object, 'submit' })
    Promise = nil
    SetNuiFocus(false, false)
    opened = false
end)

ShowInput = function(data)
    if not data then return end
    if opened then
        closeInput('re-open')
    end
    Promise = promise.new()
    opened = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        open = true,
        inputs = data.inputs,
        submitText = data.submitText,
        background_color = data.background_color
    })
    local res = Citizen.Await(Promise)
    return res[1], res[2]
end

exports('ShowInput', ShowInput)
exports('CloseInput', closeInput)

RegisterNetEvent(resource_name .. ':ShowInput', function(data)
    ShowInput(data)
end)

RegisterNetEvent(resource_name .. ':CloseInput', function(reason)
    closeInput(reason)
end)

-- CreateThread(function()
--     Wait(1500)
--     local inputData, reason = exports['keep-input']:ShowInput({
--         -- background_color = 'red',
--         inputs = {
--             {
--                 type = 'number',
--                 isRequired = true,
--                 name = 'cost_of_rental',
--                 text = 'price for renting this booth?',
--                 icon = 'fa-solid fa-money-bill-trend-up',
--                 title = 'Rental Cost',
--                 force_value = 565,
--                 disabled = true
--             },
--             {
--                 text = "Some Select",
--                 name = "someselect",
--                 type = "select",
--                 options = {
--                     { value = "none", text = "None" }, -- Options MUST include a value and a text option
--                     { value = "other", text = "Other", disabled = true },
--                     { value = "other2", text = "Other2" },
--                     { value = "other3", text = "Other3" },
--                     { value = "other4", text = "Other4" },
--                     { value = "other5", text = "Other5" },
--                     { value = "other6", text = "Other6" },
--                 },
--                 -- default = 'other3', -- Default select option, must match a value from above, this is optional
--             },
--             {
--                 text = "Some radio",
--                 name = "someradio",
--                 type = "radio",
--                 options = {
--                     { value = "none", text = "None" },
--                     { value = "other", text = "Other", disabled = true },
--                 },
--                 default = 'other', -- Default select option, must match a value from above, this is optional
--             },
--             {
--                 text = "some checkbox", -- text you want to be displayed as a input header
--                 name = "somecheckbox", -- name of the input should be unique
--                 type = "checkbox",
--                 options = {
--                     { value = "none", text = "None" }, -- Options MUST include a value and a text option
--                     { value = "other", text = "Other", disabled = true }, -- Options MUST include a value and a text option
--                     { value = "none2", text = "None" }, -- Options MUST include a value and a text option
--                     { value = "other2", text = "Other", disabled = true }, -- Options MUST include a value and a text option
--                 },
--                 default = 'none2', -- Default select option, must match a value from above, this is optional
--             }
--         }
--     })
--     print(inputData.someradio)
-- end)
