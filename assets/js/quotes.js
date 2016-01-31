var quotes = [
  {
    quote: "I love the Oscars. All sorts of tacky people win. And watching everyone run up and down those aisles is just adorable.",
    person: "Geraldine Page"
  },
  {
    quote: "I live in Spain. Oscars are something that are on TV Sunday night. Basically, very late at night. You don't watch, you just read the news after who won or who lost.",
    person: "Javier Bardem"
  },
  {
    quote: "You don't make pictures for Oscars.",
    person: "Martin Scorsese"
  },
  {
    quote: "Hosting the Oscars is much like making love to a woman. It's something I only get to do when Billy Crystal is out of town",
    person: "Steve Martin"
  },
  {
    quote: "I can't believe I am hosting the Oscars. It's an honor everyone else said no",
    person: "Seth MacFarlane"
  },
  {
    quote: "I think that if you go about making movies to win Oscars, you're really going about it the wrong way",
    person: "Nicolas Cage"
  },
  {
    quote: "Welcome to the 77th and last Oscars",
    person: "Chris Rock"
  },
  {
    quote: "When they called my name, I had this feeling I could hear half of America going, 'Oh no. Come on... Her, again?' You know. But, whatever.",
    person: "Meryl Streep"
  },
  {
    quote: "[To his Oscar] You're only two years older than me, darling. Where have you been all my life?",
    person: "Christopher Plummer"
  },
  {
    quote: "Most of all, I want to thank my father, up there, the man who when I said I wanted to be an actor, he said, 'Wonderful. Just have a back-up profession, like welding.'",
    person: "Robin Williams"
  },
  {
    quote: "The only way to find the best actor would be to let everybody play Hamlet and let the best man win.",
    person: "Humphrey Bogart"
  }
];

var idx = Math.floor(Math.random() * quotes.length);
var div = document.getElementById('quote');
var div2 = document.getElementById('quotep');
div.innerHTML = quotes[idx].quote;
div2.innerHTML = quotes[idx].person;

