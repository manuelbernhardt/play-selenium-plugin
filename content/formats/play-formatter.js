/**
 * Parse source and update TestCase. Throw an exception if any error occurs.
 *
 * @param testCase TestCase to update
 * @param source The source to parse
 */
function parse(testCase, source) {
    var doc = source;
    var rdef = /^(\w+)\(\s*(?:('(?:\\'|[^'])*'|[^.]+?)\s*(?:,\s*('(?:\\'|[^'])*'|[^.]+?)\s*)?)?\)$/;
    var r = new RegExp(rdef);
    var commands = [];
    var currentIndex = 0;
    while (doc.length > 0) {
        var lines = /(.*)(\r\n|[\r\n])?/.exec(doc);
        if (lines !== null && lines.length > 1) {
            var line = lines[1];
            var commandString = line.trim();
            var c = null;
            c = r.exec(commandString);
            if (c !== null && c.length > 1) {
                var array = c.slice(1);
                if (array.length >= 3) {
                    for (var i = 0; i < array.length; i++) {
                        if (/^'.*'$/.test(array[i])) {
                            array[i] = array[i].substring(1, array[i].length - 1);
                            array[i] = array[i].replace("\\'", "'");
                        }
                        if (array[i] == undefined) {
                            array[i] = "";
                        }
                    }
                }
                var command = new Command();
                command.command = array[0];
                command.target = array[1];
                command.value = array[2];   
                commands.push(command);
            } else {
                // this was not a recognized Play command, so we assume the whole line is a comment
                var comment = new Comment();
                comment.comment = line;
                comment.skip = line.length;
                comment.index = currentIndex;
                commands.push(comment);
            }
            currentIndex += line.length;
        }
        doc = doc.substr(lines[0].length);
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
// TODO - see if we can find a way not to write those standard headers when we save a file with existing headers
//    var result = '#{selenium \'' + name + '\'}\n\n';
    var result = formatCommands(testCase.commands);
//    result += '\n#{/selenium}';
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
            result += "    " + command.command + "(\'" + command.target + "\'" + (command.value.length > 0 ? ("," + "\'" + command.value.replace(/'/g, "\\'") + "\'") : "") + ")\n";
        } else if(command.type == 'comment') {
            result += command.comment + "\n";
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
