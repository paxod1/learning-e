

import { decode } from 'html-entities';

// ✅ Helper to remove HTML tags (used for word trimming)
function stripTags(html) {
  return html.replace(/<[^>]*>/g, '');
}

// ✅ Clean and decode broken characters, emojis, and symbols


export function cleanHtml(text) {
  if (!text) return '';
  return decode(
    text
      // Smart punctuation
      .replace(/â€™/g, '’')    // right single quote
      .replace(/â€œ/g, '“')    // left double quote
      .replace(/â€�/g, '”')    // right double quote
      .replace(/â€“/g, '–')    // en dash
      .replace(/â€”/g, '—')    // em dash
      .replace(/â€¦/g, '…')    // ellipsis
      .replace(/â€˜/g, '‘')    // left single quote
      .replace(/â€/g, '€')     // euro sign

      // Common HTML entities
      .replace(/â„¢/g, '™')
      .replace(/â©/g, '©')
      .replace(/â®/g, '®')

      // Common emoji encodings
      .replace(/ðŸŽ¥/g, '🎥')
      .replace(/ðŸ”¥/g, '🔥')
      .replace(/ðŸ‘/g, '👍')
      .replace(/ðŸ˜€/g, '😊')
      .replace(/ðŸ‘¨‍ðŸ’./g, '👨‍💻')
      .replace(/ðŸŒŸ/g, '🌟')
      .replace(/ðŸ‘Œ/g, '👌')
      .replace(/ðŸ¤—/g, '🤗')
      .replace(/ðŸ˜ˆ/g, '😍')
      .replace(/ðŸ’ª/g, '💪')
      .replace(/ðŸ’–/g, '💖')
      .replace(/ðŸ¤£/g, '🤣')
      .replace(/ðŸ¤”/g, '🤔')

      // Festival and holiday symbols
      .replace(/ðŸŒ™/g, '🌙')       // Crescent moon (Eid)
      .replace(/ðŸâœ¨/g, '🐐✨')    // Goat with sparkles
      .replace(/ðŸŽ‰/g, '🎉')        // Party popper
      .replace(/ðŸŽŠ/g, '🎊')        // Confetti ball
      .replace(/ðŸŽ‡/g, '🎇')        // Sparkler
      .replace(/ðŸŽˆ/g, '🎈')        // Balloon
      .replace(/ðŸŽ‰/g, '🎉')        // Party popper
      .replace(/ðŸŽ†/g, '🎆')        // Fireworks
      .replace(/ðŸŽ…/g, '🎅')        // Santa
      .replace(/ðŸŽ„/g, '🎄')        // Christmas tree
      .replace(/ðŸŽ¨/g, '🎨')        // Artist palette
      .replace(/ðŸŽ©/g, '🎩')        // Top hat
      .replace(/ðŸŽ®/g, '🎪')        // Circus tent
      .replace(/ðŸŽ¿/g, '🎿')        // Skis
      .replace(/ðŸ…/g, '🏅')        // Medal
      .replace(/ðŸŽ/g, '🎁')        // Gift
      .replace(/ðŸŽ€/g, '🎀')        // Ribbon

      // Religious symbols
      .replace(/â™¥ï¸/g, '♥️')     // Heart
      .replace(/â¤ï¸/g, '❤️')     // Red heart
      .replace(/â˜ºï¸/g, '☺️')     // Smiling face
      .replace(/âœ¿/g, '❣️')        // Heart exclamation
      .replace(/â¤/g, '❤')         // Heart
      .replace(/â˜º/g, '☺')         // Smiling face

      // Basic symbols and punctuation
      .replace(/â€™/g, '’')    // right single quote
      .replace(/â€œ/g, '“')    // left double quote
      .replace(/â€�/g, '”')    // right double quote
      .replace(/â€“/g, '–')    // en dash
      .replace(/â€”/g, '—')    // em dash
      .replace(/â€¦/g, '…')    // ellipsis
      .replace(/â€˜/g, '‘')    // left single quote
      .replace(/â€/g, '€')     // euro sign
      .replace(/â„¢/g, '™')     // trademark
      .replace(/â©/g, '©')      // copyright
      .replace(/â®/g, '®')      // registered

      // Smileys & Emotion
      .replace(/ðŸ˜€/g, '😀')   // grinning face
      .replace(/ðŸ˜£/g, '😃')   // smiling face with open mouth
      .replace(/ðŸ˜‰/g, '😄')   // smiling face with open mouth & smiling eyes
      .replace(/ðŸ˜‹/g, '😆')   // smiling face with open mouth & closed eyes
      .replace(/ðŸ˜Š/g, '😅')   // smiling face with open mouth & cold sweat
      .replace(/ðŸ˜/g, '😂')   // face with tears of joy
      .replace(/ðŸ˜‚/g, '🤣')   // rolling on the floor laughing
      // [Add all smileys...]

      // People & Body
      .replace(/ðŸ‘¨/g, '👨')   // man
      .replace(/ðŸ‘©/g, '👩')   // woman
      .replace(/ðŸ‘­/g, '👫')   // man and woman holding hands
      .replace(/ðŸ‘®/g, '👮')   // police officer
      // [Add all people emojis...]

      // Animals & Nature
      .replace(/ðŸ/g, '🐁')   // mouse
      .replace(/ðŸ‚/g, '🐂')   // ox
      .replace(/ðŸƒ/g, '🐃')   // water buffalo
      .replace(/ðŸ„/g, '🐄')   // cow
      // [Add all animals...]

      // Food & Drink
      .replace(/ðŸ‚/g, '🍒')   // cherries
      .replace(/ðŸ“/g, '🍓')   // strawberry
      .replace(/ðŸ”/g, '🍔')   // hamburger
      .replace(/ðŸ•/g, '🍕')   // pizza
      // [Add all food emojis...]

      // Travel & Places
      .replace(/ðŸ›¡/g, '🚁')   // helicopter
      .replace(/ðŸš€/g, '🚀')   // rocket
      .replace(/ðŸš‚/g, '🚂')   // locomotive
      .replace(/ðŸš‡/g, '🚇')   // metro
      // [Add all travel emojis...]

      // Activities
      .replace(/ðŸŽ¨/g, '🎨')   // artist palette
      .replace(/ðŸŽ©/g, '🎩')   // top hat
      .replace(/ðŸŽª/g, '🎪')   // circus tent
      .replace(/ðŸŽ«/g, '🎫')   // ticket
      // [Add all activity emojis...]

      // Objects
      .replace(/ðŸ“š/g, '📚')   // books
      .replace(/ðŸ“œ/g, '📝')   // memo
      .replace(/ðŸ“ž/g, '📞')   // telephone receiver
      .replace(/ðŸ“Ÿ/g, '📟')   // pager
      // [Add all object emojis...]

      // Symbols
      .replace(/â¤ï¸/g, '❤️')  // red heart
      .replace(/â¤/g, '❤')     // heart
      .replace(/â˜ºï¸/g, '☺️')  // smiling face
      .replace(/âœ¿/g, '❣️')    // heart exclamation
      // [Add all symbols...]

      // Flags
      .replace(/ðŸ‡¦ðŸ‡¹/g, '🇦🇹')  // Austria
      .replace(/ðŸ‡§ðŸ‡ª/g, '🇧🇪')  // Belgium
      .replace(/ðŸ‡¨ðŸ‡³/g, '🇨🇳')  // China
      .replace(/ðŸ‡ªðŸ‡«/g, '🇪🇺')  // European Union
      // [Add all flags...]

      // Special cases
      .replace(/ðŸ’/g, '💌')      // love letter (your specific request)
      .replace(/ðŸŒ™/g, '🌙')      // crescent moon (Eid)
      .replace(/ðŸâœ¨/g, '🐐✨')  // goat with sparkles
      .replace(/â€™/g, '’')    // right single quote
      .replace(/â€œ/g, '“')    // left double quote
      .replace(/â€�/g, '”')    // right double quote
      .replace(/â€“/g, '–')    // en dash
      .replace(/â€”/g, '—')    // em dash
      .replace(/â€¦/g, '…')    // ellipsis
      .replace(/â€˜/g, '‘')    // left single quote
      .replace(/â€/g, '€')     // euro sign

      // Common HTML entities
      .replace(/â„¢/g, '™')
      .replace(/â©/g, '©')
      .replace(/â®/g, '®')
      .replace(/â‰¥/g, '≥')
      .replace(/â‰¤/g, '≤')
      .replace(/â‰ /g, '≠')
      .replace(/âˆž/g, '∞')

      // Festival and holiday symbols
      .replace(/ðŸŽ¨/g, '🎨')  // artist palette
      .replace(/ðŸŽ©/g, '🎩')  // top hat
      .replace(/ðŸŽª/g, '🎪')  // circus tent
      .replace(/ðŸŽ«/g, '🎫')  // ticket
      .replace(/ðŸŽ¬/g, '🎬')  // clapper board
      .replace(/ðŸŽ­/g, '🎭')  // performing arts
      .replace(/ðŸŽ®/g, '🎮')  // video game
      .replace(/ðŸŽ¯/g, '🎯')  // direct hit
      .replace(/ðŸŽ°/g, '🎰')  // slot machine
      .replace(/ðŸŽ±/g, '🎱')  // pool 8 ball
      .replace(/ðŸŽ²/g, '🎲')  // game die
      .replace(/ðŸŽ³/g, '🎳')  // bowling
      .replace(/ðŸŽ´/g, '🎴')  // flower playing cards
      .replace(/ðŸŽµ/g, '🎵')  // musical note
      .replace(/ðŸŽ¶/g, '🎶')  // musical notes
      .replace(/ðŸŽ·/g, '🎷')  // saxophone
      .replace(/ðŸŽ¸/g, '🎸')  // guitar
      .replace(/ðŸŽ¹/g, '🎹')  // musical keyboard
      .replace(/ðŸŽº/g, '🎺')  // trumpet
      .replace(/ðŸŽ»/g, '🎻')  // violin
      .replace(/ðŸŽ¼/g, '🎼')  // musical score
      .replace(/ðŸŽ½/g, '🎽')  // running shirt
      .replace(/ðŸŽ¾/g, '🎾')  // tennis
      .replace(/ðŸŽ¿/g, '🎿')  // skis
      .replace(/ðŸ€/g, '🏀')   // basketball
      .replace(/ðŸ/g, '🏁')   // chequered flag
      .replace(/ðŸ‚/g, '🏂')   // snowboarder
      .replace(/ðŸƒ/g, '🏃')   // runner
      .replace(/ðŸ„/g, '🏄')   // surfer
      .replace(/ðŸ…/g, '🏅')   // sports medal
      .replace(/ðŸ†/g, '🏆')   // trophy
      .replace(/ðŸ‡/g, '🏇')   // horse racing
      .replace(/ðŸˆ/g, '🏈')   // american football
      .replace(/ðŸ‰/g, '🏉')   // rugby football
      .replace(/ðŸŠ/g, '🏊')   // swimmer
      .replace(/ðŸ‹/g, '🏋')   // weight lifter
      .replace(/ðŸŒ/g, '🏌')   // golfer
      .replace(/ðŸ/g, '🏍')   // motorcycle
      .replace(/ðŸŽ/g, '🏎')   // racing car
      .replace(/ðŸ/g, '🏏')   // cricket bat and ball
      .replace(/ðŸ‘/g, '🏑')   // field hockey
      .replace(/ðŸ’/g, '🏒')   // ice hockey
      .replace(/ðŸ“/g, '🏓')   // ping pong
      .replace(/ðŸ”/g, '🏔')   // snow capped mountain
      .replace(/ðŸ•/g, '🏕')   // camping
      .replace(/ðŸ–/g, '🏖')   // beach with umbrella
      .replace(/ðŸ—/g, '🏗')   // building construction
      .replace(/ðŸ˜/g, '🏘')   // houses
      .replace(/ðŸ™/g, '🏙')   // cityscape
      .replace(/ðŸš/g, '🏚')   // derelict house
      .replace(/ðŸ›/g, '🏛')   // classical building
      .replace(/ðŸœ/g, '🏜')   // desert
      .replace(/ðŸ/g, '🏝')   // desert island
      .replace(/ðŸž/g, '🏞')   // national park
      .replace(/ðŸŸ/g, '🏟')   // stadium
      .replace(/ðŸ /g, '🏠')    // house
      .replace(/ðŸ¡/g, '🏡')    // house with garden
      .replace(/ðŸ¢/g, '🏢')    // office building
      .replace(/ðŸ£/g, '🏣')    // post office
      .replace(/ðŸ¤/g, '🏤')    // european post office
      .replace(/ðŸ¥/g, '🏥')    // hospital
      .replace(/ðŸ¦/g, '🏦')    // bank
      .replace(/ðŸ§/g, '🏧')    // atm sign
      .replace(/ðŸ¨/g, '🏨')    // hotel
      .replace(/ðŸ©/g, '🏩')    // love hotel
      .replace(/ðŸª/g, '🏪')    // convenience store
      .replace(/ðŸ«/g, '🏫')    // school
      .replace(/ðŸ¬/g, '🏬')    // department store
      .replace(/ðŸ­/g, '🏭')    // factory
      .replace(/ðŸ®/g, '🏮')    // izakaya lantern
      .replace(/ðŸ¯/g, '🏯')    // japanese castle
      .replace(/ðŸ°/g, '🏰')    // european castle
      .replace(/ðŸ±/g, '🏱')    // white flag
      .replace(/ðŸ²/g, '🏲')    // black flag
      .replace(/ðŸ³/g, '🏳')    // waving white flag
      .replace(/ðŸ´/g, '🏴')    // waving black flag
      .replace(/ðŸµ/g, '🏵')    // rosette
      .replace(/ðŸ¶/g, '🏶')    // black rosette
      .replace(/ðŸ·/g, '🏷')    // label
      .replace(/ðŸ¸/g, '🏸')    // badminton
      .replace(/ðŸ¹/g, '🏹')    // bow and arrow
      .replace(/ðŸº/g, '🏺')    // amphora
      .replace(/ðŸ»/g, '🏻')    // emoji modifier
      .replace(/ðŸ¼/g, '🏼')    // emoji modifier
      .replace(/ðŸ½/g, '🏽')    // emoji modifier
      .replace(/ðŸ¾/g, '🏾')    // emoji modifier
      .replace(/ðŸ¿/g, '🏿')    // emoji modifier

      // Religious and cultural symbols
      .replace(/â™¥/g, '♥')     // heart
      .replace(/â™¦/g, '♦')     // diamond
      .replace(/â™£/g, '♣')     // club
      .replace(/â™ /g, '♠')     // spade
      .replace(/âœ¨/g, '✡')     // star of david
      .replace(/âœ¿/g, '✝')     // latin cross
      .replace(/âœ®/g, '✞')     // shadowed white latin cross
      .replace(/âœ¯/g, '✟')     // outlined latin cross
      .replace(/âœ°/g, '✠')     // maltese cross
      .replace(/âœ±/g, '✡')     // star of david
      .replace(/âœ²/g, '✢')     // four teardrop-spoked asterisk
      .replace(/âœ³/g, '✣')     // four balloon-spoked asterisk
      .replace(/âœ´/g, '✤')     // heavy four balloon-spoked asterisk
      .replace(/âœµ/g, '✥')     // four club-spoked asterisk
      .replace(/âœ¶/g, '✦')     // black four pointed star
      .replace(/âœ·/g, '✧')     // white four pointed star
      .replace(/âœ¸/g, '✨')     // sparkles
      .replace(/âœ¹/g, '✩')     // stress outlined white star
      .replace(/âœº/g, '✪')     // circled white star
      .replace(/âœ»/g, '✫')     // open center black star
      .replace(/âœ¼/g, '✬')     // black center white star
      .replace(/âœ½/g, '✭')     // outlined black star
      .replace(/âœ¾/g, '✮')     // heavy outlined black star
      .replace(/âœ¿/g, '✯')     // pinwheel star
      .replace(/â€/g, '✰')     // shadowed white star
      .replace(/â/g, '✱')     // heavy asterisk
      .replace(/â‚/g, '✲')     // open center asterisk
      .replace(/âƒ/g, '✳')     // eight spoked asterisk
      .replace(/â„/g, '✴')     // eight pointed black star
      .replace(/â…/g, '✵')     // eight pointed pinwheel star
      .replace(/â†/g, '✶')     // six pointed black star
      .replace(/â‡/g, '✷')     // eight pointed rectilinear black star
      .replace(/âˆ/g, '✸')     // heavy eight pointed rectilinear black star
      .replace(/â‰/g, '✹')     // twelve pointed black star
      .replace(/âŠ/g, '✺')     // sixteen pointed asterisk
      .replace(/â‹/g, '✻')     // teardrop-spoked asterisk
      .replace(/âŒ/g, '✼')     // open center teardrop-spoked asterisk
      .replace(/â/g, '✽')     // heavy teardrop-spoked asterisk
      .replace(/âŽ/g, '✾')     // six petalled black and white florette
      .replace(/â/g, '✿')     // black florette
      .replace(/â/g, '❀')     // white florette
      .replace(/â‘/g, '❁')     // eight petalled outlined black florette
      .replace(/â’/g, '❂')     // circled open center eight pointed star
      .replace(/â“/g, '❃')     // heavy teardrop-spoked pinwheel asterisk
      .replace(/â”/g, '❄')     // snowflake
      .replace(/â•/g, '❅')     // tight trifoliate snowflake
      .replace(/â–/g, '❆')     // heavy chevron snowflake
      .replace(/â—/g, '❇')     // sparkle
      .replace(/â˜/g, '❈')     // heavy sparkle
      .replace(/â™/g, '❉')     // balloon-spoked asterisk
      .replace(/âš/g, '❊')     // eight teardrop-spoked propeller asterisk
      .replace(/â›/g, '❋')     // heavy eight teardrop-spoked propeller asterisk
      .replace(/âœ/g, '❤')     // heavy black heart
      .replace(/â/g, '❍')     // shadowed white circle
      .replace(/âž/g, '❎')     // negative squared cross mark
      .replace(/âŸ/g, '❏')     // lower right drop-shadowed white square
      .replace(/â /g, '❐')     // upper right drop-shadowed white square
      .replace(/â¡/g, '❑')     // lower right shadowed white square
      .replace(/â¢/g, '❒')     // upper right shadowed white square
      .replace(/â£/g, '❓')     // black question mark ornament
      .replace(/â¤/g, '❔')     // white question mark ornament
      .replace(/â¥/g, '❕')     // white exclamation mark ornament
      .replace(/â¦/g, '❗')     // heavy exclamation mark symbol
      .replace(/â§/g, '❘')     // light vertical bar
      .replace(/â¨/g, '❙')     // medium vertical bar
      .replace(/â©/g, '❚')     // heavy vertical bar
      .replace(/âª/g, '❛')     // heavy single turned comma quotation mark ornament
      .replace(/â«/g, '❜')     // heavy single comma quotation mark ornament
      .replace(/â¬/g, '❝')     // heavy double turned comma quotation mark ornament
      .replace(/â­/g, '❞')     // heavy double comma quotation mark ornament
      .replace(/â®/g, '❟')     // heavy low single comma quotation mark ornament
      .replace(/â¯/g, '❠')     // heavy low double comma quotation mark ornament
      .replace(/â°/g, '❡')     // curved stem paragraph sign ornament
      .replace(/â±/g, '❢')     // heavy exclamation mark ornament
      .replace(/â²/g, '❣')     // heavy heart exclamation mark ornament
      .replace(/â³/g, '❤')     // heavy black heart
      .replace(/â´/g, '❥')     // rotated heavy black heart bullet
      .replace(/âµ/g, '❦')     // floral heart
      .replace(/â¶/g, '❧')     // rotated floral heart bullet
      .replace(/â·/g, '❨')     // medium left parenthesis ornament
      .replace(/â¸/g, '❩')     // medium right parenthesis ornament
      .replace(/â¹/g, '❪')     // medium flattened left parenthesis ornament
      .replace(/âº/g, '❫')     // medium flattened right parenthesis ornament
      .replace(/â»/g, '❬')     // medium left-pointing angle bracket ornament
      .replace(/â¼/g, '❭')     // medium right-pointing angle bracket ornament
      .replace(/â½/g, '❮')     // heavy left-pointing angle quotation mark ornament
      .replace(/â¾/g, '❯')     // heavy right-pointing angle quotation mark ornament
      .replace(/â¿/g, '❰')     // heavy left-pointing angle bracket ornament
      .replace(/â€/g, '❱')     // heavy right-pointing angle bracket ornament
      .replace(/â/g, '❲')     // light left tortoise shell bracket ornament
      .replace(/â‚/g, '❳')     // light right tortoise shell bracket ornament
      .replace(/âƒ/g, '❴')     // medium left curly bracket ornament
      .replace(/â„/g, '❵')     // medium right curly bracket ornament

      // Common emoji encodings
      .replace(/ðŸŽ¥/g, '🎥')   // movie camera
      .replace(/ðŸ”¥/g, '🔥')   // fire
      .replace(/ðŸ‘/g, '👍')   // thumbs up
      .replace(/ðŸ˜€/g, '😊')   // smiling face with smiling eyes
      .replace(/ðŸ‘¨‍ðŸ’./g, '👨‍💻') // man technologist
      .replace(/ðŸŒŸ/g, '🌟')   // glowing star
      .replace(/ðŸ‘Œ/g, '👌')   // OK hand
      .replace(/ðŸ¤—/g, '🤗')   // hugging face
      .replace(/ðŸ˜ˆ/g, '😍')   // smiling face with heart-eyes
      .replace(/ðŸ’ª/g, '💪')   // flexed biceps
      .replace(/ðŸ’–/g, '💖')   // sparkling heart
      .replace(/ðŸ¤£/g, '🤣')   // rolling on the floor laughing
      .replace(/ðŸ¤”/g, '🤔')   // thinking face


      // Fallback fix for weird characters
      .replace(/\uFFFD/g, '') // remove � chars (unknown character)
  );
}


export function getShortHtml(text, wordLimit = 30) {
  const cleaned = cleanHtml(text);
  const noHtml = stripTags(cleaned);
  const words = noHtml.split(/\s+/).slice(0, wordLimit).join(' ');
  return `${words}...`;
}

export function getShortHtmlLength(text, wordLimit = 60) {
  const cleaned = cleanHtml(text);
  const noHtml = stripTags(cleaned);
  const words = noHtml.split(/\s+/).slice(0, wordLimit).join(' ');
  return `${words}...`;
}