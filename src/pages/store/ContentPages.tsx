import React, { useState } from 'react';
import { ChevronDown, Heart, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { IMG } from '../../data/mockCatalog';
import { SafeImage } from '../../components/SafeImage';
import { BearMascotSvg, BrandLogo } from '../../components/BrandLogo';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-8 sm:p-12">
        <div className="lg:col-span-6 space-y-4">
          <div className="pb-1">
            <BrandLogo variant="secondary" size="lg" />
          </div>
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            About HUGME.AR
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#765B55] leading-tight">
            A Little More Love, A Little More HUGME.
          </h1>
          <p className="font-body text-base text-[#765B55]/85 leading-relaxed">
            HUGME.AR started with one belief: soft things make hard days gentler. Inspired by sunlit nurseries, handwritten notes, and heirloom teddy bears, every HUGME.AR plushie is curated to bring warmth, smiles, and cosy comfort.
          </p>
          <p className="font-body text-sm text-[#765B55]/75 leading-relaxed">
            From our signature cream teddy mascot with rosy cheeks to floppy bunnies, sleepy calico cats, and ribbon-tied keepsake hampers, we celebrate little toys that deliver bigger hugs.
          </p>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="mt-2 px-6 py-3 rounded-xl bg-[#C98F9D] text-white font-ui text-sm font-medium cursor-pointer"
          >
            Explore Our Plushies
          </button>
        </div>
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <SafeImage
              src={IMG.giftHamper}
              alt="HUGME.AR keepsake gift hamper"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Cloud-Soft Fabrics',
            body: 'We select dense micro-mink fleece and gentle cotton knits that feel comforting from the very first squeeze.',
          },
          {
            title: 'Gift-Ready Always',
            body: 'Soft blush tissue, satin ribbon accents, and keepsake boxes designed so unboxing feels like a warm hug.',
          },
          {
            title: 'Made For Every Age',
            body: 'Whether welcoming a newborn, cheering up a best friend, or decorating your reading corner, there is a companion for you.',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-2"
          >
            <Heart className="w-5 h-5 text-[#C98F9D]" />
            <h2 className="font-display text-xl font-semibold text-[#765B55]">{card.title}</h2>
            <p className="font-body text-sm text-[#765B55]/80 leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { submitEnquiry, siteSettings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSent(false);
    const res = await submitEnquiry({ name, email, subject, message });
    setSubmitting(false);
    if (!res.ok) {
      setErrorMsg(res.error || 'Could not send message right now.');
      return;
    }
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
              Say Hello
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55] mt-1">
              Contact HUGME.AR
            </h1>
            <p className="font-body text-sm text-[#765B55]/80 mt-2 leading-relaxed">
              Questions about bulk birthday hampers, gift notes, or plushie care? Drop us a warm message below.
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-4 text-sm font-body">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#C98F9D]" />
              <span>{siteSettings.supportEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#C98F9D]" />
              <span>{siteSettings.supportPhone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#C98F9D]" />
              <span>14 Rosemallow Lane, Bandra West, Mumbai 400050</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <BearMascotSvg className="w-8 h-8" />
            <h2 className="font-display text-2xl font-semibold text-[#765B55]">
              Send Us a Message
            </h2>
          </div>

          {sent && (
            <div className="p-3.5 rounded-xl bg-[#F4DDE3]/60 text-xs font-ui text-[#765B55]">
              Thank you for reaching out ♡ Your message has been saved and our team will reply soon.
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#F4DDE3]/75 border border-[#C98F9D]/40 text-xs font-body text-[#765B55]">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-ui text-xs text-[#765B55] mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
              />
            </div>
            <div>
              <label className="block font-ui text-xs text-[#765B55] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Custom Gift Box Enquiry"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>

          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:opacity-60 text-white font-ui text-sm font-medium cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    {
      q: 'What materials are HUGME.AR plushies made from?',
      a: 'Our plushies use ultra-soft micro-mink plush fleece, breathable cotton knits, and hypoallergenic down-alternative polyfill with child-friendly embroidered facial details.',
    },
    {
      q: 'How should I wash or clean my plushie?',
      a: 'We recommend gentle spot cleaning with lukewarm water and mild soap, followed by natural air drying away from direct sunlight. Plushies with knit accessories or wooden tags should have accessories removed before cleaning.',
    },
    {
      q: 'Do you include gift wrapping and personalised notes?',
      a: 'Yes! Our Gift Sets arrive in ribbon-tied keepsake boxes with blush tissue paper, and any plushie can be paired with complimentary keepsake wrapping notes.',
    },
    {
      q: 'Are HUGME.AR plushies safe for children and sensitive skin?',
      a: 'Yes! Every companion is crafted with ultra-soft, hypoallergenic polyfill and gentle embroidered facial features with no loose small parts.',
    },
    {
      q: 'How long does shipping normally take across India?',
      a: 'Standard dispatch takes 1–2 business days, with estimated delivery in 3–5 business days across metro cities and 5–7 days pan-India.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
          Helpful Answers
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55]">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const open = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <span className="font-display text-lg font-semibold text-[#765B55]">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C98F9D] shrink-0 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {open && (
                <div className="px-6 pb-5 font-body text-sm text-[#765B55]/80 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{
  type: 'privacy-policy' | 'terms' | 'shipping-policy' | 'return-policy';
}> = ({ type }) => {
  const policies = {
    'privacy-policy': {
      title: 'Privacy Policy',
      updated: 'November 2026',
      sections: [
        {
          h: 'Browser Preferences & Privacy',
          p: 'Your cart, wishlist, currency choice, and saved address preferences are stored inside your browser so your selections stay ready whenever you return.',
        },
        {
          h: 'Order & Delivery Details',
          p: 'Shipping details, contact numbers, and gift notes shared during checkout are used strictly to prepare and deliver your HUGME.AR parcels.',
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      updated: 'November 2026',
      sections: [
        {
          h: 'Storefront Availability & Pricing',
          p: 'All prices are listed inclusive of applicable care standards and are subject to availability. Online payment capture will be enabled once payment gateway verification is completed.',
        },
        {
          h: 'Product Imagery & Care',
          p: 'Every plushie is hand-finished; slight gentle variations in ribbon ties and embroidery give each companion its own charming personality.',
        },
      ],
    },
    'shipping-policy': {
      title: 'Shipping Policy',
      updated: 'November 2026',
      sections: [
        {
          h: 'Dispatch & Delivery Windows',
          p: 'Orders are thoughtfully packed in tissue and protective wrapping within 24–48 business hours. Metro deliveries typically arrive within 3–5 business days.',
        },
        {
          h: 'Complimentary Shipping',
          p: 'Orders above ₹999 qualify for complimentary standard shipping across India. Orders under ₹999 carry a flat ₹99 standard shipping fee.',
        },
      ],
    },
    'return-policy': {
      title: 'Return & Refund Policy',
      updated: 'November 2026',
      sections: [
        {
          h: '7-Day Gentle Return Window',
          p: 'If your plushie arrives damaged or not quite as expected, unused items with original tags and keepsake box intact may be returned within 7 days of delivery.',
        },
        {
          h: 'Hygiene & Keepsake Care',
          p: 'For safety and hygiene, plushies must remain unwashed and free from scents or stains to qualify for an exchange or refund.',
        },
      ],
    },
  }[type];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-8 sm:p-10 space-y-6">
        <div className="border-b border-[#765B55]/10 pb-5">
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            HUGME.AR Policy · Updated {policies.updated}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55] mt-1">
            {policies.title}
          </h1>
        </div>
        <div className="space-y-6">
          {policies.sections.map((sec) => (
            <div key={sec.h} className="space-y-2">
              <h2 className="font-display text-xl font-semibold text-[#765B55]">{sec.h}</h2>
              <p className="font-body text-sm sm:text-base text-[#765B55]/85 leading-relaxed">
                {sec.p}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
