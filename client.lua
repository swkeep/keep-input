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
--     Wait(500)
--     -- local inputData, reason = exports['keep-input']:ShowInput({
--     --     -- background_color = 'red',
--     --     inputs = {
--     --         {
--     --             type = 'number',
--     --             isRequired = true,
--     --             name = 'cost_of_rental',
--     --             text = 'price for renting this booth?',
--     --             icon = 'fa-solid fa-money-bill-trend-up',
--     --             title = '<span style="color:black;">something for TEST</span>'
--     --         },
--     --         {
--     --             text = "Some Select", -- text you want to be displayed as a input header
--     --             name = "someselect", -- name of the input should be unique otherwise it might override
--     --             type = "select", -- type of the input - Select is useful for 3+ amount of "or" options e.g; someselect = none OR other OR other2 OR other3...etc
--     --             options = { -- Select drop down options, the first option will by default be selected
--     --                 { value = "none", text = "None" }, -- Options MUST include a value and a text option
--     --                 { value = "other", text = "Other" }, -- Options MUST include a value and a text option
--     --                 { value = "other2", text = "Other2" }, -- Options MUST include a value and a text option
--     --                 { value = "other3", text = "Other3" }, -- Options MUST include a value and a text option
--     --                 { value = "other4", text = "Other4" }, -- Options MUST include a value and a text option
--     --                 { value = "other5", text = "Other5" }, -- Options MUST include a value and a text option
--     --                 { value = "other6", text = "Other6" }, -- Options MUST include a value and a text option
--     --             },
--     --             -- default = 'other3', -- Default select option, must match a value from above, this is optional
--     --         }
--     --     }
--     -- })
--     -- if inputData then
--     --     if not inputData.cost_of_rental then return end
--     -- end
--     local inputData, reason = exports['keep-input']:ShowInput({
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
--                 text = "Some Select", -- text you want to be displayed as a input header
--                 name = "someselect", -- name of the input should be unique otherwise it might override
--                 type = "select", -- type of the input - Select is useful for 3+ amount of "or" options e.g; someselect = none OR other OR other2 OR other3...etc
--                 options = { -- Select drop down options, the first option will by default be selected
--                     { value = "none", text = "None" }, -- Options MUST include a value and a text option
--                     { value = "other", text = "Other", disabled = true }, -- Options MUST include a value and a text option
--                     { value = "other2", text = "Other2" }, -- Options MUST include a value and a text option
--                     { value = "other3", text = "Other3" }, -- Options MUST include a value and a text option
--                     { value = "other4", text = "Other4" }, -- Options MUST include a value and a text option
--                     { value = "other5", text = "Other5" }, -- Options MUST include a value and a text option
--                     { value = "other6", text = "Other6" }, -- Options MUST include a value and a text option
--                 },
--                 -- default = 'other3', -- Default select option, must match a value from above, this is optional
--             }
--         }
--     })
-- end)
