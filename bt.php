<?php
use Illuminate\Support\Collection;
set_time_limit(0);
date_default_timezone_set('UTC');
header("Content-Type: application/json; charset=UTF-8");

require __DIR__ . '/../vendor/autoload.php';
\InstagramAPI\Instagram::$allowDangerousWebUsageAtMyOwnRisk = true;

/////// CONFIG ///////
$username = '5.8ft';
$password = '9';
$debug = false;
$truncatedDebug = false;

$ig = new \InstagramAPI\Instagram($debug, $truncatedDebug);

try {
	$ig->login($username, $password);
} catch (\Exception $e) {
	echo 'Something went wrong: ' . $e->getMessage() . "\n";
	exit(0);
}

$targetUser = '5.8ft';
if (isset($_GET["username"])) {
	$targetUser = $_GET["username"];
} 

//
try {
	$userPk = $ig->people->getUserIdForName($targetUser); // target user
	$nextMax = null; 
	$last = null; 
	$start = 1514764800; // date of 01/01/2018 00:00
	$items = [];

	// paginates one's feed till the begining of $start.
	do {
		$res = $ig->timeline->getUserFeed($userPk, $nextMax);
		$temp = $res->getItems();
		$last = intval(end($temp)->getTakenAt());
		$nextMax = $res->getNextMaxId();
		foreach ($temp as $item) {
			array_push($items, $item);
		}
	} while ($last > $start);


	$out = [];
	// removes posts that posted earlier than $start.
	for ($i = sizeof($items) - 1; $i > 0 ; $i--) { 
		if ($items[$i]->getTakenAt() < $start) {
			array_pop($items);
		} else {
			break;
		}
	}

	// rearranges $out data into self made array
	foreach ($items as $item) {
		$image = null;
		if ($item->getCarouselMedia() !== null) {
			$image = $item->getCarouselMedia()[0]->getImageVersions2();
		} else {
			$image = $item->getImageVersions2();
		}
		$out[] = [
			'id' => $item->getId(),
			'taken_at' => $item->getTakenAt(),
			'code' => $item->getCode(),
			'comment_count' => $item->getCommentCount(),
			'like_count' => $item->getLikeCount(),
			'user_pk' => $item->getUser()->getPk(),
			'username' => $item->getUser()->getUsername(),
			'full_name' => $item->getUser()->getFullName(),
			'profile_pic_url' => $item->getUser()->getProfilePicUrl(),
			'pic_url' => $image->getCandidates()[1]->getUrl(),
			'location' => $item->getLocation()
		];
	}
	
	// sort self-made array by likes, and calculates a bunch of stats
	usort($out, 'sortByLike');
	$like = getTotal($out, 'like_count');
	$comment = getTotal($out, 'comment_count');
	$count = sizeof($out);

	// rearranges the data above into a new associative array, ready to send as json.
	$data = array(
		'bestnine' => array_slice($out, 0, 9), 
		'all' => $out,
		'like' => $like,
		'comment' => ceil($comment),
		'count' => ceil($count),
		'avg_like' => ceil($like / $count),
		'avg_comment' => ceil($comment / $count),
		'username' => $out[0]["username"],
		'user_pk' => $out[0]["user_pk"],
		'full_name' => $out[0]["full_name"],
		'profile_pic_url' => $out[0]["profile_pic_url"]
	);
	
	echo json_encode($data);


} catch (\Exception $e) {
	echo 'Something went wrong: ' . $e->getMessage() . "\n";
}

function sortByLike($a, $b)
{
    $a = $a['like_count'];
    $b = $b['like_count'];

    if ($a == $b) return 0;
    return ($a < $b) ? 1 : -1;
}

function sortByComment($a, $b)
{
    $a = $a['comment_count'];
    $b = $b['comment_count'];

    if ($a == $b) return 0;
    return ($a < $b) ? 1 : -1;
}

function getTotal($a, $field)
{
	$total = 0;
	foreach ($a as $item) {
		$total += $item[$field];
	}
	return $total;
}




