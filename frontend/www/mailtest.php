<?php
$msg = "";
if (isset($_POST['submit'])) {
	$from_add = "dqj@cogentqi.com";
	$to_add = $_POST["to"];

	$subject = "Test Subject";
	$message = $_POST["body"];
	$headers = "From: $from_add \r\n";
	$headers .= "Reply-To: $from_add \r\n";
	$headers .= "Return-Path: $from_add\r\n";
	$headers .= "X-Mailer: PHP \r\n";

	if (mail($to_add, $subject, $message, $headers)) {
		$msg = "Mail sent OK";
	}
	else {
		$msg = "Error sending email!";
	}
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>Email Tester</title>
</head>

<body>
<?php echo $msg ?>

<form action='<?php echo htmlentities($_SERVER['PHP_SELF']); ?>' method='post'>
	<div style="width: 300px; margin: 2em auto; background: #DDD; border-radius:8px; padding:1em;">
		<div><input name="to" type="text" style="width:250px" value="6072277351@vtext.com"/></div>
		<div><input name="body" type="text" style="width:250px" value="Testing..."/></div>
		<div><input type='submit' name='submit' value='Submit'></div>
	</div>
</form>
<style>
	input {
		font-size: 1.3em;
		margin: 0.5em;
		padding: 0.2em;
	}
</style>

</body>
</html>