import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pollApi } from "../api/polls";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { PlusCircle, Trash2, Upload } from "lucide-react";
import { toEmbedUrl, isEmbeddable } from "../utils/embedUrl";

const CreatePoll = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const remixFrom = searchParams.get("remix");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([
    { label: "", imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "" },
    { label: "", imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "" },
  ]);
  const [allowAnonymousVotes, setAllowAnonymousVotes] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRemix, setLoadingRemix] = useState(!!remixFrom);

  // Pre-fill from remix source
  useEffect(() => {
    if (!remixFrom) return;
    const loadRemix = async () => {
      try {
        const data = await pollApi.getByShareId(remixFrom);
        setTitle(`Remix: ${data.title}`);
        setDescription(data.description || "");
        if (data.options) {
          setOptions(
            data.options.map((opt: any) => ({
              label: opt.label || "",
              imageUrl: opt.imageUrl || "",
              embedUrl: opt.embedUrl || "",
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRemix(false);
      }
    };
    loadRemix();
  }, [remixFrom]);

  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Logga in</h1>
        <p className="text-muted-foreground">Du behöver logga in för att skapa en poll.</p>
      </div>
    );
  }

  if (loadingRemix) {
    return <div className="flex items-center justify-center min-h-screen">Laddar remix...</div>;
  }

  const updateOption = (index: number, field: string, value: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, { label: "", imageUrl: "", videoUrl: "", audioUrl: "", embedUrl: "" }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploading(index);
    try {
      const data = await pollApi.upload(file);
      if (data.fileType === "video") {
        updateOption(index, "videoUrl", data.url);
      } else if (data.fileType === "audio") {
        updateOption(index, "audioUrl", data.url);
      } else {
        updateOption(index, "imageUrl", data.url || data.imageUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await pollApi.create({
        title,
        description,
        options: options.map((opt) => ({
          label: opt.label,
          imageUrl: opt.imageUrl,
          videoUrl: opt.videoUrl,
          audioUrl: opt.audioUrl,
          externalUrl: "",
          embedUrl: opt.embedUrl,
        })),
        status: "published",
        allowAnonymousVotes,
      });
      if (data.success) {
        navigate(`/poll/${data.poll.shareId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {remixFrom ? "Remixa poll" : "Skapa ny poll"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titel</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Vilken design är bäst?"
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Beskrivning (valfri)</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Berätta vad du vill ha feedback på..."
            maxLength={500}
          />
        </div>

        <div className="space-y-4">
          <Label>Alternativ (minst 2)</Label>

          {options.map((opt, i) => (
            <Card key={i}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    {i + 1}.
                  </span>
                  <Input
                    value={opt.label}
                    onChange={(e) => updateOption(i, "label", e.target.value)}
                    placeholder={`Alternativ ${i + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {opt.imageUrl ? (
                  <div className="relative">
                    <img
                      src={opt.imageUrl}
                      alt={opt.label}
                      className="w-full h-40 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => updateOption(i, "imageUrl", "")}
                    >
                      Ta bort
                    </Button>
                  </div>
                ) : opt.videoUrl ? (
                  <div className="relative">
                    <video
                      src={opt.videoUrl}
                      controls
                      className="w-full h-40 rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => updateOption(i, "videoUrl", "")}
                    >
                      Ta bort
                    </Button>
                  </div>
                ) : opt.audioUrl ? (
                  <div className="relative">
                    <audio src={opt.audioUrl} controls className="w-full" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-1"
                      onClick={() => updateOption(i, "audioUrl", "")}
                    >
                      Ta bort
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*"
                      capture="environment"
                      className="hidden"
                      id={`file-${i}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(i, file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById(`file-${i}`)?.click()
                      }
                      disabled={uploading === i}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading === i ? "Laddar upp..." : "Ladda upp fil (valfri)"}
                    </Button>
                  </div>
                )}

                <Input
                  value={opt.embedUrl}
                  onChange={(e) => updateOption(i, "embedUrl", e.target.value)}
                  placeholder="Embed-URL (valfri, t.ex. Figma-länk)"
                />

                {opt.embedUrl && toEmbedUrl(opt.embedUrl) ? (
                  <iframe
                    src={toEmbedUrl(opt.embedUrl)!}
                    title={`Preview ${opt.label}`}
                    className="w-full h-48 rounded border"
                    allowFullScreen
                  />
                ) : opt.embedUrl ? (
                  <div className="flex items-center gap-2 p-3 rounded border bg-muted text-sm">
                    <span className="truncate flex-1">{opt.embedUrl}</span>
                    <a href={opt.embedUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline shrink-0">
                      Öppna
                    </a>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Lägg till alternativ
          </Button>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={allowAnonymousVotes} onChange={(e) => setAllowAnonymousVotes(e.target.checked)} className="rounded" />
          <span className="text-sm">Tillåt anonym röstning (utan inloggning)</span>
        </label>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Skapar..." : remixFrom ? "Publicera remix" : "Publicera poll"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePoll;
