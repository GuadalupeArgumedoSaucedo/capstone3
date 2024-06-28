# Enjoy the Microblog Project and the MicroblogLite API!

Don't forget to read the [*MicroblogLite* API docs](http://microbloglite.us-east-2.elasticbeanstalk.com/docs) and experiment with the API in *Postman!*

Practice and experimentation provide experience, and experience provides confidence.



Social media website for software developers to network 
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/246a1884-9390-4f8a-9de7-3fefc2f7363b)
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/f12bba18-a826-4187-8331-52ff27e7a360)
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/6c6d08b0-d8fd-4955-835a-f0f21a708c09)
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/6801aaaf-5f94-4483-9463-64a009857669)
![image](https://github.com/GuadalupeArgumedoSaucedo/capstone3/assets/166437700/39cfa677-a519-49a6-ab76-319f4fb8c258)

</div>
    <button onclick="topFunction()" id="myBtn" title="Go to top">Scroll to Top</button>  
<div id="posts-container" class="row"></div>

// Function to scroll to the top of the document when the user clicks on a button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block"; // Show the button if scrolled down more than 20px
    } else {
        mybutton.style.display = "none"; // Hide the button if not scrolled down enough
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
