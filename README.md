# Decompose

**Decompose** is a tiny GTK app[^1] for figuring out how to type special characters.

## Features

- Copy and paste a special character to see how to type them using the [compose key](https://en.wikipedia.org/wiki/Compose_key)[^2]
- If the characters can't be typed with the compose key, it shows code points so you can type them with with [<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>U</kbd>](https://help.gnome.org/users/gnome-help/stable/tips-specialchars.html.en#ctrlshiftu)
- It always [normalizes](https://www.unicode.org/faq/normalization.html) the input
- It can ignore [variation selectors](https://en.wikipedia.org/wiki/Variant_form_(Unicode)), which is useful when working with emojis

## Usage

It can be run by executing `./decompose.js`. It depends on GJS, GTK 4, and libadwaita.

## Q&A

### It tells me to press the `<Multi_key>`. What's that?

That's the compose key.

### How to use the compose key?

See https://help.gnome.org/users/gnome-help/stable/tips-specialchars.html.en#compose.

### Shouldn't something like this be included in the GNOME Characters app?

[Maybe](https://gitlab.gnome.org/GNOME/gnome-characters/-/issues/80).

[^1]: More like a script, really. When people think of scripts, they tend to think of the command-line, but such a small graphical app ought be be considered a script.

[^2]: Technically, it only reads `/usr/share/X11/locale/en_US.UTF-8/Compose`. You may modify it to use some other path, but it doesn't support `include`, so the usefulness would be very limited (unless you manually merge your files). Also your toolkit or imput method might configure things differently. So really it should be described as "a script for grepping /usr/share/X11/locale/en_US.UTF-8/Compose", but that doesn't sound very catchy.
