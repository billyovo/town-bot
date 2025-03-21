export function cleanMessage(str: string) {
    return str.replaceAll(
        /<(?:(?<type>@[!&]?|#)|(?:\/(?<commandName>[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai} ]+):)|(?:a?:(?<emojiName>[\w]+):))(?<id>\d{17,19})>/gu,
        (match, type, commandName, emojiName, id) => {
            return "";
        },
    );
}
