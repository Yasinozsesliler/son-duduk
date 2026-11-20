package com.sonduduk.hakem;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(InAppReviewPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
