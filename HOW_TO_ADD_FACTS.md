# 🦎 How to Add Facts to the Reveal Section

## Quick Guide

The facts reveal section is now implemented! To add your facts, simply edit the `matildeFacts` array in `script.js`.

## Location
Open `script.js` and find the `matildeFacts` array (around line 92).

## Format
Each fact follows this structure:

```javascript
{
    id: 1,                    // Unique number (1, 2, 3, etc.)
    text: "An adult Matilde could eat up to",  // Text before the number
    number: 100,              // The number to reveal
    unit: "pieces of red meat in a hotpot"     // Text after the number
}
```

## Example
Here's how to add more facts:

```javascript
const matildeFacts = [
    {
        id: 1,
        text: "An adult Matilde could eat up to",
        number: 100,
        unit: "pieces of red meat in a hotpot"
    },
    {
        id: 2,
        text: "Matilde can speak",
        number: 5,
        unit: "languages fluently"
    },
    {
        id: 3,
        text: "Matilde has visited",
        number: 42,
        unit: "countries"
    },
    {
        id: 4,
        text: "Matilde can solve a Rubik's cube in",
        number: 30,
        unit: "seconds"
    }
];
```

## Features
- ✅ Click "Reveal" button to show the number
- ✅ Smooth animation when revealing
- ✅ Sparkle effects on reveal
- ✅ Revealed facts are saved (persist after page reload)
- ✅ Responsive design (works on mobile)
- ✅ Matches your site's whimsical aesthetic

## Tips
- Make sure each fact has a unique `id`
- The `text` and `unit` can be any text you want
- The `number` can be any number
- Facts are displayed in the order you add them to the array

That's it! Just add your facts to the array and they'll appear on the website! 🎉

