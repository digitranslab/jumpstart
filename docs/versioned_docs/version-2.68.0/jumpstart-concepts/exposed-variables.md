---
id: exposed-variables
title: Exposed Variables
---

Exposed Variables help in accessing and manipulating data within components. These variables are automatically created and updated as users interact with the application. Whether it's capturing text from a text editor, checking the visibility of a component or retrieving selections from a dropdown menu, exposed variables are integral for dynamic data handling in JumpStart applications.

<div class="video-container">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/w8kIHnfpvi4?si=qETkjzdR6HyjU6yw&rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<div style={{paddingTop:'24px', paddingBottom:'24px'}}>

## Accessing Exposed Variables
Each component in JumpStart has its own set of exposed variables, which hold specific data related to that component. For example, in the Text Input component, the `value` variable is used. This variable is updated every time a user enters something in the text editor. It can be dynamically accessed using JavaScript notation: `{{components.textinput1.value}}`. This feature allows developers to easily track and utilize the data entered by users in real-time.

</div>

For detailed information about the exposed variables of the components, please refer to their respective documentation.