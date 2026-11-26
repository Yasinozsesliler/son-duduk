package com.sonduduk.hakem;

import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import androidx.core.content.FileProvider;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;

/** Tekrar klibini (video) sistemin paylaşım menüsüyle paylaşır. JS: registerPlugin("ClipShare").share({ data, name, mime, text }) */
@CapacitorPlugin(name = "ClipShare")
public class ClipSharePlugin extends Plugin {

    @PluginMethod
    public void share(PluginCall call) {
        String b64 = call.getString("data");
        if (b64 == null || getActivity() == null) {
            call.reject("no data");
            return;
        }
        String name = call.getString("name", "refmania.mp4");
        String mime = call.getString("mime", "video/mp4");
        String text = call.getString("text", "");
        try {
            File dir = new File(getContext().getCacheDir(), "clips");
            if (!dir.exists()) dir.mkdirs();
            File f = new File(dir, name);
            try (FileOutputStream out = new FileOutputStream(f)) {
                out.write(Base64.decode(b64, Base64.DEFAULT));
            }
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f);
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType(mime.startsWith("video") ? mime : "video/*");
            send.putExtra(Intent.EXTRA_STREAM, uri);
            if (!text.isEmpty()) send.putExtra(Intent.EXTRA_TEXT, text);
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getActivity().startActivity(Intent.createChooser(send, null));
            call.resolve();
        } catch (Exception e) {
            call.reject("share failed", e);
        }
    }
}
