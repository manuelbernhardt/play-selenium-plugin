/**
 * Parse source and update TestCase. Throw an exception if any error occurs.
 *
 * @param testCase TestCase to update
 * @param source The source to parse
 */
function parse(testCase, source) {
    var doc = source;
    var commands = [];
    while (doc.length > 0) {
        var line = /^(\w+)\(\s*(?:('(?:\\'|[^'])*'|[^.]+?)\s*(?:,\s*('(?:\\'|[^'])*'|[^.]+?)\s*)?)?\)$/.exec(doc);
        var array = line[1].split(/,/);
        if (array.length >= 3) {
            for (var i = 0; i < array.length; i++) {
                if (/^'.*'$/.test(array[i])) {
                    array[i] = array[i].substring(1, array[i].length() - 1);
                    array[i] = array[i].replace("\\'", "'");
                }
            }
            var command = new Command();
            command.command = array[0];
            command.target = array[1];
            command.value = array[2];
            commands.push(command);
        }
        doc = doc.substr(line[0].length);
    }
    testCase.setCommands(commands);
}

/**
 * Format TestCase and return the source.
 *
 * @param testCase TestCase to format
 * @param name The name of the test case, if any. It may be used to embed title into the source.
 */
function format(testCase, name) {
    var result = '#{selenium \'' + name + '\'}\n\n';
    result += formatCommands(testCase.commands);
    result += '\n#{/selenium}';
    return result;
}

/**
 * Format an array of commands to the snippet of source.
 * Used to copy the source into the clipboard.
 *
 * @param The array of commands to sort.
 */
function formatCommands(commands) {
    var result = '';
    for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        if (command.type == 'command') {
            result += command.command + "(\'" + command.target + "\'"  + (command.value.length > 0 ? ("," + "\'" + command.value + "\'") : "") + ")\n";
        }
    }
    return result;
}

/*
 * Optional: The customizable option that can be used in format/parse functions.
 */
//options = {nameOfTheOption: 'The Default Value'}

/*
 * Optional: XUL XML String for the UI of the options dialog
 */
//configForm = '<textbox id="options_nameOfTheOption"/>'
