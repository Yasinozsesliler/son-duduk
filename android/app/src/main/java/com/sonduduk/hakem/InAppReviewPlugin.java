package com.sonduduk.hakem;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;

/** Puan isteme penceresi (Play In-App Review). JS: registerPlugin("InAppReview").requestReview() */
@CapacitorPlugin(name = "InAppReview")
public class InAppReviewPlugin extends Plugin {

    @PluginMethod
    public void requestReview(PluginCall call) {
        ReviewManager manager = ReviewManagerFactory.create(getContext());
        manager.requestReviewFlow().addOnCompleteListener(task -> {
            if (!task.isSuccessful() || getActivity() == null) {
                call.resolve();
                return;
            }
            manager.launchReviewFlow(getActivity(), task.getResult())
                .addOnCompleteListener(done -> call.resolve());
        });
    }
}
