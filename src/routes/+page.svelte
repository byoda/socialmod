<script>
    import {get_keyname} from '$lib/utils.ts';
    // urls = localStorage.getItem();
</script>
<h1>Welcome to BYOMod</h1>
<p>BYOmod empowers you to decide who you want to moderate for you. You can enter one or more URLs pointing to BYOMod documents created by people you trust. BYOmod will then use those documents to generate blocklist for each social network that BYOMod supports.</p>
<p>For Twitter/X, BYOmod will use the 'block' functionality of Twitter to block the Twitter accounts listed in the blocklist</p>
<form>
    <div><label for='byomod_url1'>BYOMod URL</label><input id='byomod_url1' type='text' name="byomod_url1"/></div>
    <div><input type='submit' value='Submit'></div>
</form>