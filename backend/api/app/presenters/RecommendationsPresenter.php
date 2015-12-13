<?php
/**
 * Created by PhpStorm.
 * User: Greg Emerson
 * Date: 11/20/15
 * Time: 10:42 AM
 */

namespace App\Presenters;

use ResourcesModule\BasePresenter,
    App\Model\Recommendation;

class RecommendationsPresenter extends BasePresenter {

    public function actionRead($id, $mode = self::MODE_LISTING) {
        Recommendation::createRecommendationsForAssessment(
            $this->database, $id);
        $this->sendResult(['ok']);
    }
}